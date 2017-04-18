
import UIMenu from './components/UIMenu'

import '../sass/main.scss'

// @TODO This mapping should be ideally provided by a route resolving
window.widgets = {
  menu: UIMenu
}

document.addEventListener('DOMContentLoaded', () => {
  const directives = document.querySelectorAll('[data-ui-widget]')
  const l = directives.length
  let i = 0

  if (l) {
    for (; i<l; i++) {
      let directiveDomNode = directives[i]
      let directiveName = directiveDomNode.dataset.uiWidget

      if (typeof widgets[directiveName] !== 'undefined') {
        new widgets[directiveName](directiveDomNode)
      }
    }
  }
});
