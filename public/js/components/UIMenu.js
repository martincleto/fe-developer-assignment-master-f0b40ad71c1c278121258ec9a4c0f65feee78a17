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

    this.model = domNode.getAttribute('data-model')

    api.get(this.model).then(data => {
      this.data = data
      this.render()
    })
  }

  render() {
    this.build()
    this.setBehaviour()
  }

  build() {
    let data = this.data
    let i = 0
    let l = data.length
    let output = ''

    for (; i<l; i++) {
      output += `<li id="menu-item-${i+1}" data-source="${this.model}/${data[i].id}" class="menu__item" ><a href="/${this.model}/${data[i].id}" aria-role="button">${data[i].name}</a></li>`
    }

    this.domNode.id = `uuid-${this.uuid}`
    this.domNode.classList.add('menu')
    this.domNode.insertAdjacentHTML('beforeend', `<ul class="menu__list">${output}</ul>`)
  }

  buildItemDetail(context, data) {
    context.insertAdjacentHTML(
      'beforeend',
      `<article itemscope itemtype="http://schema.org/Hotel" class="detail" aria-hidden="true">
        <div class="detail__inner-wrapper">
          <div class="detail__image">
            <img src="${data.imgUrl}" alt="Picture of ${data.name}" itemprop="photo">
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

    return context.lastElementChild
  }

  setBehaviour() {
    let buttons = document.querySelectorAll(`#${this.domNode.id} [aria-role="button"]`)
    let i = 0
    let l = buttons.length
    let activeMenuItems
    let activeMenuItemsSel
    let button
    let item

    for (; i<l; i++) {
      buttons[i].addEventListener('click', evt => {
        evt.preventDefault()

        button = evt.target
        item = button.parentNode
        activeMenuItemsSel = `#${this.domNode.id} .menu__item--active:not(#${item.id})`
        activeMenuItems = document.querySelectorAll(activeMenuItemsSel)

        if (activeMenuItems.length) {
          this.hideItems(activeMenuItems)
        }

        this.showItem(item)
        // @TODO manage widget state based on History API
        //this.updateWidgetState(item)
      })
    }
  }

  hideItems(items) {
    items.forEach(item => {
      item.classList.remove('menu__item--active')
      this.setDetailVisibility(item.children[1])
    })
  }

  showItem(item) {
    const active = this.getItemState(item)
    let detail = item.children[1]

    if (active) {
      this.setDetailVisibility(detail)
    } else {
      this.checkItemCache(item).then(data => {
        if (!detail) {
          detail = this.buildItemDetail(item, data)
        }

        this.setDetailVisibility(detail)
      })
    }

    this.setItemState(item)
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

/*
  updateWidgetState(activeItem) {
    const activeItemIndex = Array.from(activeItem.parentNode.children).indexOf(activeItem)
    const path = activeItem.dataset.source
    const data = sessionStorage.getItem(path)
    const {name} = JSON.parse(data)

    history.replaceState({activeItemIndex: activeItemIndex }, name, path)
  }
*/
}

export default UIMenu
