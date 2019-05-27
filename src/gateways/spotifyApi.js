import axios from 'axios'
import store from '../store'

let token = store.getters.ACCESS_TOKEN

export default axios.create({
  baseURL: 'https://api.spotify.com/v1',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer ' + token
  }
})