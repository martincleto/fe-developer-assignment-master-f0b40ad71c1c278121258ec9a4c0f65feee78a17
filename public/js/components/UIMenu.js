
import UIComponent from './UIComponent'
import {api} from '../services/api'

class UIMenu extends UIComponent {
  constructor(domNode) {
    super(domNode)

    this.model = domNode.getAttribute('data-model')
    this.cache = {}

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
      output += `<li class="menu__item"><a href="/${this.model}/${data[i].id}" data-source="${this.model}/${data[i].id}" aria-role="button">${data[i].name}</a></li>`
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
    let activeMenuItems

    for (let button of buttons) {
      button.addEventListener('click', evt => {
        evt.preventDefault()
        activeMenuItems = document.querySelectorAll(`#${this.domNode.id} .menu__item--active`)

        this.hide.apply(activeMenuItems)
        this.show.apply(button)
      })
    }
  }

  show() {
    this.parentNode.classList.toggle('menu__item--active')

    let resourcePath = this.getAttribute('data-source')
    let cachedItem = sessionStorage.getItem(resourcePath)
    let parentNode = this.parentNode
    let itemIndex = Array.from(parentNode.parentNode.children).indexOf(parentNode)
    let title = `${window.title} - `

    if (!cachedItem) {
      api.get(resourcePath).then(data => {
        console.log(data)
        parentNode.insertAdjacentHTML(
          'beforeend',
          `<article itemscope itemtype="http://schema.org/Hotel" class="detail" aria-hidden="true">
            <img src="${data.imgSrc}" alt="Picture of ${data.name}" itemprop="photo" class="detail__image">
              <header>
                <h2 itemprop="name" class="detail__title">${data.name}</h2>
                <p itemprop="review" class="detail__rating"><span>${data.rating} out of 5</span></p>
              </header>
              <footer>
                <strong class="detail__price">&pound; ${data.rating}</strong>
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

    history.pushState({activeItemIndex: itemIndex }, title, this.href)
  }

  render() {
    this.build()
    this.setBehaviour()
  }
}

export default UIMenu
