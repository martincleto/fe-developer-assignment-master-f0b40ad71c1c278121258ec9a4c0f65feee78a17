/**
 * Abstract class UIComponent
 * @property {object} domNode
 * @property {string} uuid
 * @property {string} template
 * @public {function} generateId
 * @public {function} render
 */

class UIComponent {
  constructor(domNode) {
    if (this.constructor === UIComponent) { // new.target.name causes some issues
      throw new TypeError('Abstract class "UIComponent" cannot be instantiated directly')
    }

    if (typeof this.render === 'undefined') {
      throw new TypeError('Classes extending "UIComponent" must implement a "render" method')
    }

    this.domNode = domNode
    this.model = null
    this.uuid = this.generateId()
  }

  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random()*16|0
        let v = c === 'x' ? r : (r&0x3|0x8)

        return v.toString(16)
    })
  }
}

export default UIComponent
