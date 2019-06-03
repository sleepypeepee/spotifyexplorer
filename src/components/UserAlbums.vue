<template>
	<v-card class="userAlbums">

    <v-slide-y-transition>
      <v-list v-if="albums.length > 0" two-line>
        <v-subheader>
          My Saved Albums
        </v-subheader>
        <v-divider></v-divider>

        <router-link v-for="album in albums" :key="album.album.id" :to="{ name: 'albumdetails', params: { id: album.album.id } }" class="link-white">
          <v-list-tile avatar class="list-item">
            <v-list-tile-avatar tile>
              <v-img v-if="album.album.images.length > 0" :src="album.album.images[0].url">
                <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </v-img>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                {{album.album.name}}
                <span class="caption right">Saved {{album.added_at | formatTimeElapsed}} ago</span>
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{album.album.artists[0].name}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider></v-divider>
        </router-link>
      </v-list>
    </v-slide-y-transition>

    <p v-if="albums.length < 1 && endOfResults" class="pa-3">No albums available.</p>
    <div v-if="loadingContent && !endOfResults" class="loader">
      <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'UserAlbums',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      albums: [],
      albumOffset: 0,
      loadingContent: false,
      endOfResults: false
    }
  },
  computed: {
     ...mapGetters({
      fetchedAlbums: 'USER_ALBUMS'
    })
  },
  watch: {
    fetchedAlbums() {
      this.loadingContent = false

      if (Array.isArray(this.fetchedAlbums)) {
        if (this.fetchedAlbums.length > 0) {
          this.albums = this.albums.concat(this.fetchedAlbums)
        } else {
          this.endOfResults = true
        }
      }
    }
  },
  methods: {
    getAlbums() {
      this.loadingContent = true

      if (this.albumOffset === 0) { // If fetching first 20 results, I don't want to concat to existing array
        this.albums = [];
      }
      this.$store.dispatch('getUserAlbums', this.albumOffset)
      this.albumOffset = this.albumOffset + 20
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
        this.getAlbums()
      }
    }
  },
  created() {
    this.getAlbums()
  },
  mounted() {
    window.addEventListener('scroll', this.lazyLoad);
  },
  destroyed () {
    window.removeEventListener('scroll', this.lazyLoad);
  }
}
</script>