import Vue from 'vue'
import store from './store'
import router from './router'
import './plugins/vuetify'
import moment from 'moment'
import App from './App.vue'

Vue.config.productionTip = false

Vue.filter('formatTime', function(value) {
	if (value) {
   return moment.utc(value).format('mm:ss')
  }
})
Vue.filter('formatDateToYear', function(value) {
	if (value) {
   return moment(value).format('YYYY')
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')