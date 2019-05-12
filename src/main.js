import Vue from 'vue'
import store from './store'
import router from './router'
import axios from 'axios'
import './plugins/vuetify'
import moment from 'moment'
import Vue2Filters from 'vue2-filters'
import App from './App.vue'

Vue.config.productionTip = false

Vue.filter('formatTime', function(value) {
	if (value) {
   return moment.utc(value).format('mm:ss')
  }
})
Vue.filter('formatTimeToMin', function(value) {
  if (value) {
    let tempTime = moment.duration(value),
        hours = tempTime.hours() > 0 ?  tempTime.hours() + ' hr' : '',
        time = hours + ' ' + tempTime.minutes() + ' min';
    return time;
  }
})
Vue.filter('formatTimeElapsed', function(value) {
  if (value) {
    let startTime = moment(value),
        elapsedTime = moment.duration(moment().diff(startTime)).humanize();
    return elapsedTime;
  }
})
Vue.filter('formatDateToYear', function(value) {
	if (value) {
   return moment(value).format('YYYY')
  }
})

Vue.use(Vue2Filters)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')