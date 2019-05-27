<template>
  <v-app dark>
    <div v-if="authorised">

      <v-navigation-drawer app v-model="userNavDrawerVisible" fixed temporary right dark class="userDrawer pb-0">
        <div class="panel">
          <header>

            <v-toolbar v-if="user" flat class="transparent">
              <v-list class="pa-0">
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                      <v-img v-if="user.images.length > 0" :src="user.images[0].url">
                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </v-img>
                      <v-icon v-else dark class="grey darken-2">account_circle</v-icon>
                  </v-list-tile-avatar>
      
                  <v-list-tile-content>
                    <v-list-tile-title>{{user.display_name}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-toolbar>

          </header>
          <section>

            <v-list class="pt-0" dense>
              <v-divider></v-divider>
      
              <v-list-tile href="https://www.spotify.com/account/overview/" target="_blank">
                <v-list-tile-action>
                  <v-icon>settings</v-icon>
                </v-list-tile-action>
      
                <v-list-tile-content>
                  <v-list-tile-title>Account Settings</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile @click="logout">
                <v-list-tile-action>
                  <v-icon>logout</v-icon>
                </v-list-tile-action>
      
                <v-list-tile-content>
                  <v-list-tile-title>Log Out</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

          </section>
          <footer>
            <div class="pa-3">

              <v-layout justify-center>
                <p><i class="fab fa-spotify"></i> Spotify<span class="font-weight-bold">Explorer</span></p>
              </v-layout>
              <v-layout justify-center>
                <p class="caption">Created by <strong><a class="link-white" href="http://www.robmarriott.com" target="_blank">Rob Marriott</a></strong></p>
              </v-layout>
              <v-layout justify-center>
                <a class="link-white" href="https://github.com/sleepypeepee" target="_blank"><i class="fab fa-github footerIcon pl-2 pr-2"></i></a>
                <a class="link-white" href="https://www.linkedin.com/in/robert-marriott-6272b984/" target="_blank"><i class="fab fa-linkedin footerIcon pl-2 pr-2"></i></a>
              </v-layout>

            </div>
          </footer>
        </div>
      </v-navigation-drawer>

      <v-navigation-drawer v-if="$vuetify.breakpoint.lgAndUp" :mini-variant="miniDrawer" app fixed permanent class="navDrawer pb-0 grey darken-4">
        <div class="panel">
          <header>

            <v-toolbar v-if="user" flat class="transparent">
              <v-list class="pa-0">
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                      <i class="fab fa-spotify spotifyLogo"></i>
                  </v-list-tile-avatar>
      
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span>Spotify</span>
                      <span class="font-weight-bold">Explorer</span></v-list-tile-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn icon @click.stop="miniDrawer = !miniDrawer">
                      <v-icon>chevron_left</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-toolbar>

          </header>
          <section>

            <v-list class="pt-0">
              <v-divider></v-divider>
      
              <v-list-tile to="/library" active-class="green">
                <v-list-tile-action>
                  <v-icon>library_music</v-icon>
                </v-list-tile-action>
      
                <v-list-tile-content>
                  <v-list-tile-title>Library</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile to="/search" active-class="green">
                <v-list-tile-action>
                  <v-icon>search</v-icon>
                </v-list-tile-action>
      
                <v-list-tile-content>
                  <v-list-tile-title>Artist Search</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile to="/history" active-class="green">
                <v-list-tile-action>
                  <v-icon>history</v-icon>
                </v-list-tile-action>
      
                <v-list-tile-content>
                  <v-list-tile-title>History</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>

            </v-list>

            <v-layout justify-center v-if="miniDrawer">
              <v-btn icon @click.stop="miniDrawer = !miniDrawer">
                <v-icon>chevron_right</v-icon>
              </v-btn>
            </v-layout>

          </section>
          <footer>

            <!-- TODO: Desktop player here too? -->
            <!-- <Player /> -->

          </footer>
        </div>
      </v-navigation-drawer>

      <v-toolbar app tabs scroll-off-screen :scroll-threshold="50" :class="{'green': mobileSubView}">
        <v-btn v-if="$route.meta.subView" @click="$router.go(-1)" icon>
          <v-icon>arrow_back</v-icon>
        </v-btn>

        <v-toolbar-title :class="{'display-1 font-weight-black': $vuetify.breakpoint.lgAndUp}">
          {{title}}
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon @click="toggleUserNavDrawer">
          <div v-if="user">
            <v-avatar v-if="user.images.length > 0" :tile="false" :size="40" color="grey lighten-4">
              <v-img :src="user.images[0].url" alt="avatar"></v-img>
            </v-avatar>
          </div>
          <v-icon v-else>account_circle</v-icon>
        </v-btn>

        <template v-slot:extension v-if="tabView">
          <router-view name="navigation"></router-view>
        </template>
      </v-toolbar>

      <v-content class="mb-5">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>

        <v-slide-y-transition>
          <Player />
        </v-slide-y-transition>
      </v-content>

      <!-- <div v-if="trackPlaying" class="mediaPlayer"></div> -->
<!--       <v-slide-y-transition>
        <Player />
      </v-slide-y-transition> -->

     <!--  <v-bottom-nav app fixed>
        <Player />
      </v-bottom-nav> -->

      <v-bottom-nav v-if="$vuetify.breakpoint.mdAndDown" :value="true" app fixed dark>
        <v-btn color="white" flat to="/library">
          <span>Library</span>
          <v-icon>library_music</v-icon>
        </v-btn>
  
        <v-btn color="white" flat to="/search">
          <span>Search</span>
          <v-icon>search</v-icon>
        </v-btn>
  
        <v-btn color="white" flat to="/history">
          <span>History</span>
          <v-icon>history</v-icon>
        </v-btn>
      </v-bottom-nav>

    </div>
  </v-app>
</template>

<script>
import Player from './components/Player'

export default {
  name: 'App',
  components: {
    Player
  },
  data() {
    return {
      miniDrawer: true,
      userNavDrawerVisible: false,
      title: ''
    }
  },
  computed: {
    authorised() {
      return this.$store.state.authorised
    },
    user() {
      return this.$store.getters.USER
    },
    mobileSubView() {
      return this.$route.meta.subView && this.$vuetify.breakpoint.mdAndDown ? true : false
    },
    tabView() {
      return this.$route.meta.tabView ? true : false
    }
  },
  watch: {
    authorised() {
      this.$store.dispatch('getUser')
    }
  },
  methods: {
    authorise() {
      if (!this.authorised) {

        const hash = window.location.hash
        .substring(2)
        .split('&')
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
        window.location.hash = '';

        // Set token
        let _token = hash.access_token;

        const authEndpoint = 'https://accounts.spotify.com/authorize';
        const clientId = this.$store.state.clientId;
        const windowHref = window.location.href.replace(/(\/#|\/|#)$/, '');

        // TODO: Test... can this just be:
        // const redirectUri = windowHref;
        const redirectUri =
        location.host === 'localhost:8080'
          ? 'http://localhost:8080'
          : windowHref;

        const scopes = [
          'user-library-read',
          'user-library-modify',
          'user-top-read',
          'user-read-recently-played',
          'user-follow-read',
          'user-follow-modify',
          'user-read-birthdate', 
          'user-read-email', 
          'user-read-private',
          'playlist-read-private',
          'playlist-read-collaborative',
          'playlist-modify-public',
          'playlist-modify-private',
          'streaming',
          'user-read-playback-state',
          'user-modify-playback-state',
          'user-read-currently-playing'
        ];

        if (!_token) {
          window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
        }
        this.$store.dispatch('setToken', _token)

        this.$router.push('/')
      }
    },
    toggleUserNavDrawer() {
      this.userNavDrawerVisible = !this.userNavDrawerVisible
    },
    logout() {
      this.$store.dispatch('removeToken')
      // TODO: Return promose from store when removing token, then authorise() (ie. hit the login page again)
      // this.authorise()
      window.location = 'https://www.spotify.com/logout/';

    }
  },
  created() {
    this.$root.$on('update:title', data => {
      this.title = data
    });
  },
  mounted() {
    this.authorise()
  }
}
</script>
<style>

html { background-color: #212121; }
a.link-white { 
  color: #fff;
  text-decoration: none;
}
a.link-white:hover { color: #ccc; }
a.link-green { 
  color: #1ed760;
  text-decoration: none;
}
a.link-green:hover { color: #3bf77d; }
.spotifyGreen { color: #1ed760; }

.overlay { 
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.4);
}

.spotifyLogo { font-size: 36px; }

.list-item:hover, .list-item.active { background-color: #515151; color: #fff; }
.currentTracklist .list-item:hover, .currentTracklist .list-item.active { background-color: #313131; }
.list-item.unavailable, 
.list-item.unavailable .v-list__tile__sub-title,
.currentTracklist .list-item.unavailable,
.currentTracklist .list-item.unavailable .v-list__tile__sub-title { color: #9e9e9e; }

.gallery-image-title { padding: 10px 0; }

.loader { 
  height: 100px;
  padding: 10px;
}
.loader .v-progress-circular.listProgress { 
  display: block;
  margin: 0 auto;
}

.v-navigation-drawer .panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}
.v-navigation-drawer .panel header { flex-shrink: 0; }
.v-navigation-drawer .panel section {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 2em;
}
.v-navigation-drawer .panel footer { flex-shrink: 0; }
.v-navigation-drawer .footerIcon { font-size: 20px; }

.userDrawer { z-index: 900; }

/* Router transitions */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active { opacity: 0 }
</style>