import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: 'library/userplaylists'
    },
    {
      path: '/library',
      name: 'library',
      redirect: 'library/userplaylists',
      components: {
        default: () => import('./views/Library.vue'),
        navigation: () => import('./components/LibraryNav.vue')
      },
      meta: {
        subView: false,
        tabView: true
      },
      children: [
        {
          path: 'userplaylists', 
          name: 'userplaylists', 
          components: {
            default: () => import('./components/UserPlaylists.vue')
          },
          meta: {
            subView: false,
            tabView: true
          }
        },
        {
          path: 'useralbums', 
          name: 'useralbums', 
          components: {
            default: () => import('./components/UserAlbums.vue')
          },
          meta: {
            subView: false,
            tabView: true
          }
        },
        {
          path: 'userartists', 
          name: 'userartists', 
          components: {
            default: () => import('./components/UserArtists.vue')
          },
          meta: {
            subView: false,
            tabView: true
          }
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./views/Search.vue'),
      meta: {
        subView: false,
        tabView: false
      }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('./views/History.vue'),
      meta: {
        subView: false,
        tabView: false
      }
    },
    {
      path: '/artistdetails/:id',
      name: 'artistdetails',
      components: {
        default: () => import('./views/ArtistDetails.vue'),
        navigation: () => import('./components/ArtistNav.vue')
      },
      meta: {
        subView: true,
        tabView: true
      },
      children: [
        {
          path: 'artistoverview', 
          name: 'artistoverview', 
          component: () => import('./components/ArtistOverview.vue'),
          meta: {
            subView: true,
            tabView: true
          }
        },
        {
          path: 'artistabout', 
          name: 'artistabout', 
          component: () => import('./components/ArtistAbout.vue'),
          meta: {
            subView: true,
            tabView: true
          }
        }
      ]
    },
    {
      path: '/albumdetails/:id',
      name: 'albumdetails',
      component: () => import('./views/AlbumDetails.vue'),
      meta: {
        subView: true,
        tabView: false
      }
    },
    {
      path: '/playlistdetails/:id',
      name: 'playlistdetails',
      component: () => import('./views/PlaylistDetails.vue'),
      meta: {
        subView: true,
        tabView: false
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
})
