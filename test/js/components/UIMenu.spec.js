'use strict'

import UIMenu from '../../../public/js/components/UIMenu'
import {api} from '../../../public/js/services/api'

const mockData = require('../../../data/json/hotels.json')
const mockResponse = []

for (let prop in mockData) {
  mockResponse.push(mockData[prop])
}

const mockApiPromise = new Promise(resolve => {
  resolve(mockResponse)
})

let createDirective = () => {
  let mockDirective = document.createElement('div')
  mockDirective.setAttribute('data-widget-ui', 'menu')
  mockDirective.setAttribute('data-model', 'hotels')

  document.body.appendChild(mockDirective)
}

let randomIndex = Math.floor(Math.random() * Object.keys(mockData).length)
let button
let uiMenu
let uiMenuItems

describe('UIComponent.js', () => {

  beforeAll((done) => {
    createDirective()

    spyOn(api, 'get').and.returnValue(mockApiPromise)

    new UIMenu(document.querySelector('[data-widget-ui="menu"]'))

    setTimeout(() => {
      uiMenuItems = document.querySelectorAll('.menu__item')
      button = uiMenuItems[randomIndex].firstChild

      button.addEventListener('click', function(evt) {
        console.log('button ' + evt.target.href + ' clicked!')
        console.log(button.parentNode.classList)
      })
      done()
    }, 100)

  })

  it('should render as many items as in model', () => {
    expect(uiMenuItems.length).toEqual(mockResponse.length)
  })

  it('should show a not cached item info a user clicks on a button', () => {
    button.click()
  })

  it('should hide an item info a user clicks on a previously clicked button', () => {
    button.click()
  })

  xit('should show a cached item info a user clicks on a button', () => {

  })

  xit('should hide the other visible item info when a user clicks on a button', () => {
    
  })
})
