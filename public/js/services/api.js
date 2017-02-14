
'use strict'

class Api {
  constructor(config) {
    this.baseUrl = 'http://localhost:8765/api'
  }

  status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  json(response) {
    return response.json()
  }

  request(path, opts = {}) {
    let defaults = {
      method: 'get',
      mode: 'cors'
    }
    let options = Object.assign({}, opts, defaults)
    let request = new Request(`${this.baseUrl}/${path}`, options)

    return new Promise((resolve, reject) => {
      fetch(request)
        .then(this.status)
        .then(this.json)
        .then(data => {
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  get(path) {
    return this.request(path)
  }
}

export let api = new Api()
