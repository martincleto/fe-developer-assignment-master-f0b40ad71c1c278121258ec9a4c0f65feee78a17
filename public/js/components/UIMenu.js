/**
 * Class UIMenu
 * @extends UIComponent
 * @property {string} uuid
 * @property {object} domNode
 * @property {object} model
 * @public {function} render
 * @public {function} build
 * @public {function} buildItemDetail
 * @public {function} setBehaviour
 * @public {function} hideItems
 * @public {function} showItem
 * @public {function} setDetailVisibility
 * @public {function} checkItemCache
 * @public {function} getItemState
 * @public {function} setItemState
 * @public {function} storeData
 */

import UIComponent from './UIComponent'
import {api} from '../services/api'

class UIMenu extends UIComponent {
  constructor(domNode) {
    super(domNode)

    //this.model = domNode.getAttribute('data-model')
    this.model = domNode.dataset.model
    this.activeItem = null

    api.get(this.model).then(data => {
      this.data = data
      this.render()
    })

    if (history.state && typeof history.state.activeItem !== 'undefined') {
      this.activeItem = history.state.activeItem
    }
  }

  render() {
    this.build()
    this.setBehaviour()
  }

  build() {
    const data = this.data
    const dataLength = data.length
    let i = 0
    let output = ''

    for (; i < dataLength; i++) {
      output += `<li id="menu-item-${i+1}" data-source="${this.model}/${data[i].id}" data-active="false" class="menu__item" ><a href="/${this.model}/${data[i].id}" aria-role="button">${data[i].name}</a></li>`
    }

    this.domNode.id = `uuid-${this.uuid}`
    this.domNode.classList.add('menu')
    this.domNode.insertAdjacentHTML('beforeend', `<ul class="menu__list">${output}</ul>`)
  }

  buildItemDetail(domContext, data) {
    domContext.insertAdjacentHTML(
      'beforeend',
      `<article itemscope itemtype="http://schema.org/Hotel" class="detail" aria-hidden="true">
        <div class="detail__inner-wrapper">
          <div class="detail__image">
            <img src="/${data.imgUrl}" alt="Picture of ${data.name}" itemprop="photo">
          </div>
          <header>
            <h2 itemprop="name" class="detail__title">${data.name}</h2>
            <p itemprop="review" class="detail__rating detail__rating--${data.rating}"><span>${data.rating} out of 5</span></p>
          </header>
          <footer class="detail__footer">
            <strong class="detail__price">&pound; ${data.price}.00</strong>
            <span class="detail__price-info">Total hotel stay</span>
          </footer>
        </div>
      </article>`)

    return domContext.lastElementChild
  }

  setBehaviour() {
    const buttons = this.domNode.querySelectorAll('[aria-role="button"]')
    const buttonsLength = buttons.length
    let i = 0
    let activeMenuItems
    let button
    let item

    for (; i < buttonsLength; i++) {
      buttons[i].addEventListener('click', evt => {
        evt.preventDefault()

        button = evt.target
        item = button.parentNode
        activeMenuItems = this.domNode.querySelectorAll(`.menu__item--active:not(#${item.id})`)

        if (activeMenuItems.length) {
          this.hideItems(activeMenuItems)
        }

        this.showItem(item)
      })
    }

    document.addEventListener('show', evt => {
      this.updateWidgetState(item)
    })
  }

  hideItems(items) {
    items.forEach(item => {
      item.classList.remove('menu__item--active')
      this.setDetailVisibility(item.children[1])
    })
  }

  showItem(item) {
    const active = this.getItemState(item)
    const event = new Event('show')
    let detail = item.children[1]

    this.setItemState(item)

    if (active) {
      this.setDetailVisibility(detail)
      item.dispatchEvent(event)
    } else {
      this.checkItemCache(item)
        .then(data => {
          if (!detail) {
            detail = this.buildItemDetail(item, data)
          }

          this.setDetailVisibility(detail)
          item.dispatchEvent(event)
        })
        .catch(error => {
          throw error
        })
    }
  }

  setDetailVisibility(detail) {
    let isActiveItem = this.getItemState(detail.parentNode)

    detail.setAttribute('aria-hidden', !isActiveItem)
  }

  checkItemCache(item) {
    return new Promise((resolve, reject) => {
      const dataSource = item.dataset.source
      const cachedItem = sessionStorage.getItem(dataSource)
      const detail = item.children[1]

      if (!cachedItem) {
        api.get(dataSource)
          .then(data => {
            this.storeData(dataSource, JSON.stringify(data))
            resolve(data)
          })
          .catch(error => {
            reject(err)
          })
      } else {
        let cachedData = JSON.parse(cachedItem)

        resolve(cachedData)
      }
    })
  }

  storeData(key, data) {
    sessionStorage.setItem(key, data)
  }

  getItemState(item) {
    return item.classList.contains('menu__item--active')
  }

  setItemState(item) {
    let active = this.getItemState(item)
    let toggle = active ?  'remove' : 'add'
    //this.parentNode.classList.toggle('menu__item--active') seems not to be working nice in browsers
    item.classList[toggle]('menu__item--active')
  }

  updateWidgetState(activeItem) {
    const activeItemIndex = Array.from(activeItem.parentNode.children).indexOf(activeItem)
    const activeItemPath = activeItem.dataset.source
    const activeItemData = sessionStorage.getItem(activeItemPath)
    const {name} = JSON.parse(activeItemData)

    this.activeItem = activeItem

    history.pushState({activeItemIndex: activeItemIndex }, name, `../${activeItemPath}`)
    document.title = name
  }
}

export default UIMenu
