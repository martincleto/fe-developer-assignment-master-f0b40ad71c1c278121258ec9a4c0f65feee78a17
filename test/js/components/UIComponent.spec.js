
import UIComponent from '../../../public/js/components/UIComponent'

class MockChildUIComponentNoRender extends UIComponent {
  constructor() {
    super()
  }
}

let instantiate = ChildClass => {
  let Constructor = ChildClass ? ChildClass : UIComponent

  new Constructor()
}

let errorMessage = ''

describe('UIComponent.js', () => {

  afterEach(() => {
    errorMessage = ''
  })

  it('can\'t not be instantiated', () => {
    try {
      instantiate()
    } catch(err) {
      /* eslint-disable no-console */
      console.log(err.name, err.message)
      /* eslint-enable no-console */
      errorMessage = err.message
    } finally {
      expect(instantiate).toThrowError(TypeError)
      expect(errorMessage).toEqual('Abstract class "UIComponent" cannot be instantiated directly')
    }
  })

  it('should enforce subclasses to implement a `render` method', () => {
    try {
      instantiate(MockChildUIComponentNoRender)
    } catch(err) {
      /* eslint-disable no-console */
      console.log(err.name, err.message)
      /* eslint-enable no-console */
      errorMessage = err.message
    } finally {
      expect(instantiate).toThrowError(TypeError)
      expect(errorMessage).toEqual('Classes extending "UIComponent" must implement a "render" method')
    }
  })
})
