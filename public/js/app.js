
import {api} from './services/api'

import '../sass/main.scss'

document.addEventListener('DOMContentLoaded', function() {

  let hotels = api.get('hotels')

  hotels.then(data => {
    console.log('hotels', data)
  })
});
