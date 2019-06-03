import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root'
    },
    {
      path: '/library',
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
          path: '/', 
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
      component: () => import('./views/Search.vue'),
      meta: {
        subView: false,
        tabView: false
      },
      children: [
        {
          path: '/', 
          name: 'usertop', 
          components: {
            default: () => import('./components/UserTop.vue')
          },
          meta: {
            subView: false,
            tabView: false
          }
        },
        {
          path: 'results', 
          name: 'results', 
          components: {
            default: () => import('./components/Results.vue')
          },
          meta: {
            subView: false,
            tabView: false
          }
        },
        {
          path: 'songresults', 
          name: 'songresults', 
          components: {
            default: () => import('./components/SongResults.vue')
          },
          meta: {
            subView: false,
            tabView: false
          }
        },
        {
          path: 'artistresults', 
          name: 'artistresults', 
          components: {
            default: () => import('./components/ArtistResults.vue')
          },
          meta: {
            subView: false,
            tabView: false
          }
        },
        {
          path: 'albumresults', 
          name: 'albumresults', 
          components: {
            default: () => import('./components/AlbumResults.vue')
          },
          meta: {
            subView: false,
            tabView: false
          }
        },
        {
          path: 'playlistresults', 
          name: 'playlistresults', 
          components: {
            default: () => import('./components/PlaylistResults.vue')
          },
          meta: {
            subView: false,
            tabView: false
          }
        },
        {
          path: 'allresults', 
          name: 'allresults', 
          components: {
            default: () => import('./components/ResultsPanel.vue')
          },
          props: true,
          meta: {
            subView: false,
            tabView: false
          }
        }
      ]
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
      redirect: '/artistdetails/:id/artistoverview',
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
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})
