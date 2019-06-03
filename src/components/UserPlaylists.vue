<template>
  <v-card class="userPlaylists">
    
    <v-slide-y-transition>
      <v-list two-line v-if="playlists.length > 0">
        <v-subheader>
          My Playlists
        </v-subheader>
        <v-divider></v-divider>

        <router-link v-for="playlist in playlists" :key="playlist.id" :to="{ name: 'playlistdetails', params: { id: playlist.id } }" class="link-white">
          <v-list-tile avatar class="list-item">
            <v-list-tile-avatar tile>
              <!-- TODO: if artist.images.length < 1 load in a default icon -->
              <v-img v-if="playlist.images.length > 0" :src="playlist.images[0].url">
                <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </v-img>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                {{playlist.name}}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{playlist.tracks.total}} tracks
                <span class="caption right">Created by <span class="font-weight-bold">{{playlist.owner.display_name}}</span></span>
              </v-list-tile-sub-title>

            </v-list-tile-content>
          </v-list-tile>

          <v-divider></v-divider>
        </router-link>
      </v-list>
    </v-slide-y-transition>

    <p v-if="playlists.length < 1 && endOfResults" class="pa-3">No playlists available.</p>
    <div class="loader" v-if="loadingContent && !endOfResults">
      <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'UserPlaylists',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      playlists: [],
      offset: 0,
      loadingContent: false,
      endOfResults: false
    }
  },
  computed: {
    ...mapGetters({
      fetchedPlaylists: 'USER_PLAYLISTS'
    })
  },
  watch: {
    fetchedPlaylists() {
      this.loadingContent = false

      if (Array.isArray(this.fetchedPlaylists)) {
        if (this.fetchedPlaylists.length > 0) {
          this.playlists = this.playlists.concat(this.fetchedPlaylists)
        } else {
          this.endOfResults = true
        }
      }
    }
  },
  methods: {
    getPlaylists() {
      this.loadingContent = true

      if (this.offset === 0) { // If fetching first 20 results, don't concat to existing playlists array
        this.playlists = [];
      }
      this.$store.dispatch('getUserPlaylists', this.offset)
      this.offset = this.offset + 20
    },
    getDocHeight() {
      var D = document;
      return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
      );
    },
    getScrollTop() {
      var D = document;
      return Math.max(
        window.pageYOffset, D.documentElement.scrollTop, D.body.scrollTop, 0
      );
    },
    lazyLoad() {
      let scrollTop = Math.ceil(this.getScrollTop()),
          bottomOfWindow = scrollTop + window.outerHeight >= this.getDocHeight();

      if (bottomOfWindow && !this.endOfResults) {
        // get more search results
        this.getPlaylists()
      }
    }
  },
  created() {
    this.getPlaylists()
  },
  mounted() {
    window.addEventListener('scroll', this.lazyLoad)
  },
  destroyed() {
    window.removeEventListener('scroll', this.lazyLoad)
  }
}
</script>