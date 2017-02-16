import app from '../../public/js/app'
import UIMenu from '../../public/js/components/UIMenu'

describe('app.js', () => {

  let eventLoad = new Event('DOMContentLoaded')

  beforeEach(() => {

  })

  it('should instantiate UIMenu', () => {



    document.dispatchEvent(eventLoad)

    spyOn(UIMenu.prototype, 'constructor')

    console.log('test', UIMenu.prototype)



    expect(UIMenu.prototype.constructor).toHaveBeenCalled()
  })
})
