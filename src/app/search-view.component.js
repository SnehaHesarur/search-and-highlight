import React, { Component } from 'react'
import { searchData } from '../constants/data.constant'
import './search-view.component.scss'

function handleSearch (searchQuery) {
  const searchQueryLowerCase = searchQuery.toLowerCase()
  const results = searchData.filter((item) => {
    if (item.id.toLowerCase().includes(searchQueryLowerCase)) {
      return true
    }
    if (item.name && item.name.toLowerCase().includes(searchQueryLowerCase)) {
      return true
    }
    if (item.address && item.address.toLowerCase().includes(searchQueryLowerCase)) {
      return true
    }
    if (item.pincode && item.pincode.toLowerCase().includes(searchQueryLowerCase)) {
      return true
    }
    if (item.items && item.items.length) {
      let matchFound = false
      item.items.forEach((itemInfo) => {
        if (itemInfo.toLowerCase().includes(searchQueryLowerCase)) {
          matchFound = true
        }
      })
      return matchFound
    }
    return false
  })
  return results
}

function EmptyView (props) {
  return (
    <div className='no-results-found'>{'No User Found.'}</div>
  )
}

class SearchView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchQuery: '',
      searchTimer: null,
      searchResults: null,
      focusedElement: null
    }
  }

  handleOnChange = (e) => {
    const value = e.target.value
    this.setState({
      searchQuery: value
    })
    clearTimeout(this.state.searchTimer)

    if (value) {
      const newSearchTimer = setTimeout(() => {
        const searchResultsCopy = handleSearch(value)
        this.setState({
          searchResults: searchResultsCopy
        })
      }, 400)
  
      this.setState({
        searchTimer: newSearchTimer
      })
    }
  }

  handleHighlightElement = (e) => {
    const { focusedElement } = this.state

    if (focusedElement) {
      focusedElement.classList.remove('focused')
    }
    e.currentTarget.classList.add('focused')
    this.setState({
      focusedElement: e.currentTarget
    })
  }

  handleKeyboardInteraction = (e) => {
    let currentIndex = 0
    const { focusedElement, searchResults } = this.state
    if (focusedElement) {
      focusedElement.classList.remove('focused')
      currentIndex = Number(focusedElement.id)
    }

    if (e.keyCode === 38) {
      if (focusedElement) {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : searchResults.length - 1
      } else {
        currentIndex = 0
      }
    } else if (e.keyCode === 40) {
      if (focusedElement) {
        currentIndex = currentIndex === searchResults.length - 1 ? 0 : currentIndex + 1
      } else {
        currentIndex = 0
      }
    }

    const element = document.getElementById(currentIndex)
    if (element) {
      element.classList.add('focused')
      element.scrollIntoViewIfNeeded()
    }
    this.setState({
      focusedElement: element
    })
  }

  handleKeyUp = (e) => {
    this.handleKeyboardInteraction(e)
  }

  renderSearchResultsView = () => {
    const { searchResults } = this.state
    return (
      <div className='search-results'>
        {
          !searchResults.length
            ? <EmptyView />
            : searchResults.map((data, index) => {
              return (
                <div data-id={data.id} id={index} key={index} className='search-item' onMouseOver={this.handleHighlightElement}>
                  <div className='id'>{data.id}</div>
                  <div className='name'>{data.name}</div>
                  <div className='address'>{data.address}</div>
                  <div className='items'>{data.items && data.items.length ? data.items.join(', ') : ''}</div>
                </div>
              )
            })
        }
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp.bind(this))
  }

  render () {
    const {
      searchResults,
      searchQuery
    } = this.state
    return (
      <div className='search-main-container'>
        <div className='search-container'>
          {/* <div className='search-label'>Search titles.</div> */}
          <input type='text' className='search-input' onChange={this.handleOnChange} value={searchQuery} placeholder='Search...' />
        </div>
        {
          searchQuery && searchResults && this.renderSearchResultsView()
        }
      </div>
    )
  }
}

export default SearchView
