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
    this.domNode.insertAdjacentHTML('beforeend', `<ul class="menu__list">${output}</ul>`)
  }

  buildItemDetail(data, context) {
    context.insertAdjacentHTML(
      'beforeend',
      `<article itemscope itemtype="http://schema.org/Hotel" class="detail" aria-hidden="true">
        <img src="${data.imgUrl}" alt="Picture of ${data.name}" itemprop="photo" class="detail__image">
        <header>
          <h2 itemprop="name" class="detail__title">${data.name}</h2>
          <p itemprop="review" class="detail__rating detail__rating--${data.rating}"><span>${data.rating} out of 5</span></p>
        </header>
        <footer>
          <strong class="detail__price">&pound; ${data.price}</strong>
          <span class="detail__price-info">Total hotel stay</span>
        </footer>
      </article>`)
  }

  hide(items) {
    items.forEach(item => {
      item.classList.remove('menu__item--active')
      item.children[1].setAttribute('aria-hidden', 'true')
    })
  }

  store(key, data) {
    sessionStorage.setItem(key, data)
  }

  setBehaviour() {
    let buttons = document.querySelectorAll(`#${this.domNode.id} [aria-role="button"]`)
    let i = 0
    let l = buttons.length
    let activeMenuItems
    let activeMenuItemsSel
    let button
    let dataSource
    let parentNode

    for (; i<l; i++) {
      buttons[i].addEventListener('click', evt => {
        evt.preventDefault()

        button = evt.target
        dataSource = button.getAttribute('data-source')
        parentNode = button.parentNode

        activeMenuItemsSel = `#${this.domNode.id} .menu__item--active:not(#${parentNode.id})`
        activeMenuItems = document.querySelectorAll(activeMenuItemsSel)

        if (activeMenuItems.length) {
          this.hide(activeMenuItems)
        }

        this.show(parentNode, dataSource)
      })
    }
  }

  show(item, dataSource) {
    let visible = item.classList.contains('menu__item--active')
    let toggle = visible ?  'remove' : 'add'
    let detail = item.children[0].nextSibling

    if (!visible) {
      let cachedItem = sessionStorage.getItem(dataSource)
      let itemIndex = Array.from(item.parentNode.children).indexOf(item)
      let title = `${document.title} - `

      if (!cachedItem) {
        api.get(dataSource).then(data => {
          this.buildItemDetail(data, item)
          this.store(dataSource, JSON.stringify(data))
          item.children[1].setAttribute('aria-hidden', visible)
          title += data.name
        })
      } else {
        let cachedData = JSON.parse(cachedItem)

        if (!detail) {
          this.buildItemDetail(cachedData, item)
        }

        item.children[1].setAttribute('aria-hidden', visible)
        title += cachedData.name
      }
    }

    if (detail) {
      item.children[1].setAttribute('aria-hidden', visible) // @TODO don't DRY
    }

    //this.parentNode.classList.toggle('menu__item--active') seems not to be working nice in browsers
    item.classList[toggle]('menu__item--active')

    // @TODO manage widget state based on History API
    //history.pushState({activeItemIndex: itemIndex }, title, this.href)
  }

  render() {
    this.build()
    this.setBehaviour()
  }
}

export default UIMenu
