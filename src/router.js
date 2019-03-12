import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/artistdetails/:id',
      name: 'artistdetails',
      component: () => import('./views/ArtistDetails.vue')
    },
    {
      path: '/albumdetails/:id',
      name: 'albumdetails',
      component: () => import('./views/AlbumDetails.vue')
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
})
