import {api} from '../../../public/js/services/api'

const dataMock = require('../../../data/json/hotels.json')

let randomId = Math.floor(Math.random() * Object.keys(dataMock).length) + 1
let results

describe('api.js', () => {

  beforeEach(done => {
    api.get(`hotels/${randomId}`).then(data => {
      results = data
      done()
    })
  })

  it('should have a base URL defined', () => {
    expect(api.baseUrl).toBeDefined()
  })

  it('get() should retrieve data', () => {
    expect(results).toEqual(dataMock[`${randomId}`])
  })
})
