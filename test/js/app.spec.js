import app from '../../public/js/app'
import UIMenu from '../../public/js/components/UIMenu'

xdescribe('app.js', () => {

  let eventLoad = new Event('DOMContentLoaded')

  beforeEach(() => {

  })

  it('should instantiate UIMenu', () => {

spyOn(UIMenu.prototype, 'render')

    document.dispatchEvent(eventLoad)



    console.log('test', UIMenu.prototype)



    expect(UIMenu.prototype.render).toHaveBeenCalled()
  })
})
