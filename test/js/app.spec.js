import app from '../../public/js/app'
import UIMenu from '../../public/js/components/UIMenu'

const createDirective = () => {
  let mockDirective = document.createElement('div')
  mockDirective.setAttribute('data-ui-widget', 'menu')
  mockDirective.setAttribute('data-model', 'hotels')

  document.body.appendChild(mockDirective)
}

const eventLoad = new Event('DOMContentLoaded')
let widgets

describe('app.js', () => {

  beforeAll(() => {
    widgets = window.widgets
    createDirective()
  })

  it('should instantiate UIMenu', () => {
    spyOn(widgets, 'menu')

    document.dispatchEvent(eventLoad)

    expect(widgets.menu).toHaveBeenCalled()
  })
})
