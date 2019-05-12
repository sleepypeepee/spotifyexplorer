<template>
	<v-card class="userAlbums">
    <v-list v-if="albums.length > 0" two-line>
      <v-subheader>
        My Saved Albums
      </v-subheader>
      <v-divider></v-divider>

      <router-link v-for="album in albums" :key="album.album.id" :to="{ name: 'albumdetails', params: { id: album.album.id } }" class="link-white">
        <v-list-tile avatar class="list-item">
          <v-list-tile-avatar >
            <!-- TODO: if artist.images.length < 1 load in a default icon -->
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

    <p v-if="albums.length < 1 && endOfResults" class="pa-3">No albums available.</p>
    <div v-if="loadingContent && !endOfResults" class="loader">
      <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import Vue2Filters from 'vue2-filters'

export default {
  name: 'UserAlbums',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      albums: [],
      offset: 0,
      loadingContent: false,
      endOfResults: false
    }
  },
  computed: {
    fetchedAlbums() {
      return this.$store.getters.USER_ALBUMS
    }
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

      if (this.offset === 0) { // If fetching first 20 results, I don't want to concat to existing array
        this.albums = [];
      }
      this.$store.dispatch('getUserAlbums', this.offset)
      this.offset = this.offset + 20
    },
    lazyLoad() {

      function getDocHeight() {
        var D = document;
        return Math.max(
          D.body.scrollHeight, D.documentElement.scrollHeight,
          D.body.offsetHeight, D.documentElement.offsetHeight,
          D.body.clientHeight, D.documentElement.clientHeight
        );
      }
      function getScrollTop() {
        var D = document;
        return Math.max(
          window.pageYOffset, D.documentElement.scrollTop, D.body.scrollTop, 0
        );
      }

      window.onscroll = () => {
        let scrollTop = Math.ceil(getScrollTop()),
            bottomOfWindow = scrollTop + window.outerHeight >= getDocHeight();

        if (bottomOfWindow && !this.endOfResults) {
          // get more search results
          this.getAlbums()
        }
      };
    }
  },
  created() {
    this.getAlbums()
  },
  mounted() {
    this.lazyLoad()
  }
}
</script>