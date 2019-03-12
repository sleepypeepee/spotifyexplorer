<template>
  <v-app dark>
    <v-toolbar app>
      <router-link to="/" class="link-green">
        <v-toolbar-title class="headline text-uppercase">
            <span>Spotify</span>
            <span class="font-weight-light">Explorer</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  computed: {
    authorised() {
      return this.$store.state.authorised
    }
  },
  watch: {
    authorised() {
      this.$router.push('/')
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

        const redirectUri =
        location.host === 'localhost:8080'
          ? 'http://localhost:8080'
          : 'http://robmarriott.com/spotifyexplorer';
        const scopes = [
          'user-top-read'
        ];
        if (!_token) {
          window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;

        }
        this.$store.dispatch('setToken', _token)

      }
    },
  },
  mounted() {
    this.authorise()
  }
}
</script>
<style>
html { background-color: #212121; }
a.link-green { 
  color: #1ed760;
  text-decoration: none;
}
a.link-green:hover {
  color: #3bf77d;
}
.list-item:hover { background-color: #515151 }

/* Router transitions */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>