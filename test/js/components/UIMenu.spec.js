
import UIMenu from '../../../public/js/components/UIMenu'
import {api} from '../../../public/js/services/api'

const mockData = require('../../../data/json/hotels.json')
const mockResponse = []

for (let prop in mockData) {
  mockResponse.push(mockData[prop])
}

const randomIndex = Math.floor(Math.random() * Object.keys(mockData).length)

const mockApiPromiseAll = new Promise(resolve => {
  resolve(mockResponse)
})

const mockApiPromiseOne = new Promise(resolve => {
  resolve(mockResponse[randomIndex])
})

const createDirective = () => {
  let mockDirective = document.createElement('div')
  mockDirective.setAttribute('data-widget-ui', 'menu')
  mockDirective.setAttribute('data-model', 'hotels')

  document.body.appendChild(mockDirective)
}

const clearSessionStorage = () => {
  Object.keys(sessionStorage)
    .filter(function(key) {
      return /hotels/.test(key)
    })
    .forEach(function(key) {
      sessionStorage.removeItem(key)
    })
}

let button
let detail
let uiMenuItems

describe('UIComponent.js', () => {

  beforeAll((done) => {
    clearSessionStorage()
    createDirective()

    // @see https://jasmine.github.io/2.5/introduction#section-Spies:_%3Ccode%3Eand.returnValues%3C/code%3E
    // bet it's a smarter way to do this
    spyOn(api,'get').and.returnValues(
      mockApiPromiseAll,
      mockApiPromiseOne,
      mockApiPromiseOne,
      mockApiPromiseOne,
      mockApiPromiseOne,
      mockApiPromiseOne
    )

    new UIMenu(document.querySelector('[data-widget-ui="menu"]'))

    setTimeout(() => {
      uiMenuItems = document.querySelectorAll('.menu__item')
      button = uiMenuItems[randomIndex].firstChild

      done()
    }, 200)
  })

  beforeEach(() => {
    console.log(location.href)
  })

  it('should render as many items as in model', () => {
    expect(uiMenuItems.length).toEqual(mockResponse.length)
  })

  it('should show a not cached item info a user clicks on a button', (done) => {
    button.click()

    setTimeout(() => {
      detail = button.nextSibling

      expect(api.get).toHaveBeenCalled()
      expect(detail.getAttribute('aria-hidden')).toEqual('false') // toBeFalsy() doesn't convert 'true/false'-like strings
      done()
    }, 200)
  })

  it('should hide an item info a user clicks on a previously clicked button', (done) => {
    button.click()

    setTimeout(() => {
      detail = button.nextSibling

      expect(detail.getAttribute('aria-hidden')).toEqual('true') // toBeTruthy() doesn't convert 'true/false'-like strings
      done()
    }, 200)
  })

  it('should show a cached item info a user clicks on a button', (done) => {
    button.click()

    setTimeout(() => {
      detail = button.nextSibling

      expect(detail.getAttribute('aria-hidden')).toEqual('false')
      done()
    }, 200)

  })

  it('should hide the other visible item info when a user clicks on a button', (done) => {
    let buttonParentNode = button.parentNode
    let anotherButton = document.querySelector(`.menu__item:not(#${buttonParentNode.id}) > a`)

    button.click()
    anotherButton.click()

    setTimeout(() => {
      expect(buttonParentNode.classList.contains('menu__item--active')).toBeFalsy()
      done()
    }, 200)
  })
})
