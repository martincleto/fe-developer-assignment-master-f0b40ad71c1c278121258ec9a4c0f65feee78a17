import app from '../../public/js/app'
import UIMenu from '../../public/js/components/UIMenu'

let createDirective = () => {
  let mockDirective = document.createElement('div')
  mockDirective.setAttribute('data-ui-widget', 'menu')
  mockDirective.setAttribute('data-model', 'hotels')

  document.body.appendChild(mockDirective)
}

let eventLoad = new Event('DOMContentLoaded')

describe('app.js', () => {

  beforeAll(() => {
    createDirective()
  })

  it('should instantiate UIMenu', () => {
    spyOn(window, 'UIMenu')

    document.dispatchEvent(eventLoad)

    expect(window.UIMenu).toHaveBeenCalled()
  })
})
