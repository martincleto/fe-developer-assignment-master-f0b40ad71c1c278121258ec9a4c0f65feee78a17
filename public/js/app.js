// @TODO Find a way to import dinamically the component Classes
import UIMenu from './components/UIMenu'

import '../sass/main.scss'

window.UIMenu = UIMenu

document.addEventListener('DOMContentLoaded', () => {
  let directives = document.querySelectorAll('[data-ui-widget]')
  let i = 0
  let l = directives.length

  if (l) {
    for (; i<l; i++) {
      let domNode = directives[i]
      let widgetName = domNode.getAttribute('data-ui-widget')
      let WidgetConstructor = 'UI' + widgetName.charAt(0).toUpperCase() + widgetName.slice(1)

      new window[WidgetConstructor](domNode)

      console.log('window.UIMenu called')
    }
  }
});
