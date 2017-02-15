/**
 * Class UIMenu
 * @extends UIComponent
 * @property {string} uuid
 * @property {object} domNode
 * @property {object} domNode
 * @public {function} generateId
 * @public {function} render
 */

import UIComponent from './UIComponent'
import {api} from '../services/api'

class UIMenu extends UIComponent {
  constructor(domNode) {
    super(domNode)

    this.model = domNode.getAttribute('data-model')

    api.get(this.model).then(data => {
      this.data = data
      this.render()
    })
  }

  build() {
    let data = this.data
    let i = 0
    let l = data.length
    let output = ''

    for (; i<l; i++) {
      output += `<li class="menu__item" id="menu-item-${i+1}"><a href="/${this.model}/${data[i].id}" data-source="${this.model}/${data[i].id}" aria-role="button">${data[i].name}</a></li>`
    }

    this.domNode.id = `uuid-${this.uuid}`
    this.domNode.classList.add('menu')
    this.domNode.insertAdjacentHTML('beforeend', `<ul>${output}</ul>`)
  }

  hide() {
    this.forEach(item => {
      item.classList.remove('menu__item--active')
    })
  }

  setBehaviour() {
    let buttons = document.querySelectorAll(`#${this.domNode.id} [aria-role="button"]`)
    let i = 0
    let l = buttons.length
    let activeMenuItems
    let activeMenuItemsSel
    let button

    for (; i<l; i++) {
      button = buttons[i]

      button.addEventListener('click', evt => {
        evt.preventDefault()

        activeMenuItemsSel = `#${this.domNode.id} .menu__item--active:not(#${button.parentNode.id})`
        activeMenuItems = document.querySelectorAll(activeMenuItemsSel)

        if (activeMenuItems.length) {
          this.hide.apply(activeMenuItems)
        }

        this.show.apply(button)
      })
    }
  }

  show() {
    let toggle = this.parentNode.classList.contains('menu__item--active')? 'remove' : 'add'

    //this.parentNode.classList.toggle('menu__item--active') seems not to be working nice in browsers
    this.parentNode.classList[toggle]('menu__item--active')

    let resourcePath = this.getAttribute('data-source')
    let cachedItem = sessionStorage.getItem(resourcePath)
    let parentNode = this.parentNode
    let itemIndex = Array.from(parentNode.parentNode.children).indexOf(parentNode)
    let title = `${document.title} - `

    if (!cachedItem) {
      api.get(resourcePath).then(data => {
        parentNode.insertAdjacentHTML(
          'beforeend',
          `<article itemscope itemtype="http://schema.org/Hotel" class="detail" aria-hidden="false">
            <img src="${data.imgSrc}" alt="Picture of ${data.name}" itemprop="photo" class="detail__image">
              <header>
                <h2 itemprop="name" class="detail__title">${data.name}</h2>
                <p itemprop="review" class="detail__rating"><span>${data.rating} out of 5</span></p>
              </header>
              <footer>
                <strong class="detail__price">&pound; ${data.price}</strong>
                <span class="detail__price-info">Total hotel stay</span>
              </footer>
          </article>`)
        sessionStorage.setItem(resourcePath, JSON.stringify(data))
        title += data.name
      })
    } else {
      let cachedData = JSON.parse(cachedItem)
      title += cachedData.name
    }

    //history.pushState({activeItemIndex: itemIndex }, title, this.href)
  }

  render() {
    this.build()
    this.setBehaviour()
  }
}

export default UIMenu
