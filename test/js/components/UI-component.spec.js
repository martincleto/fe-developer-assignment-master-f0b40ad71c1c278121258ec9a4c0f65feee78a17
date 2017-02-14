import UIComponent from '../../../public/js/component/UI-component'

class MockChildUIComponent extends UIComponent {
  constructor() {
    super()
  }
}

let ui-some

describe('UI-component.js', () => {

  beforeAll(() => {
    ui-some = new MockChildUIComponent()
  })

  it('can\'t not be instantiated', () => {
    expect(ui-some).toThrow(new TypeError(''))
  })

  it('should enforce subclasses to implement a `template` property', () => {
    expect(ui-some).toThrow(new TypeError(''))
  })

  it('should enforce subclasses to implement a `render` method', () => {
    expect(ui-some).toThrow(new TypeError(''))
  })
})
