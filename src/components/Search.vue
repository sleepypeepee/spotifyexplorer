<template>
  <v-container class="search" flex>
    <v-layout v-if="$vuetify.breakpoint.mdAndDown" row>
      <v-flex pb-3>

        <h1 class="font-weight-black" :class="{'display-3': $vuetify.breakpoint.mdAndUp, 'display-2': $vuetify.breakpoint.smOnly, 'display-1': $vuetify.breakpoint.xsOnly}">Artist Search</h1>

      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex pb-3>

        <v-card>
          <v-text-field
            v-model="searchValue"
            label="Enter artist name"
            :rules="searchValidation"
            outline
            required
            clearable
            append-icon="search"
            @click:append="search"
            v-on:keyup.enter="search"
          ></v-text-field>

          <v-slide-y-transition>
            <v-list two-line v-if="artists.length > 0" >
              <v-subheader v-if="!searchDirty">
                Your Top Artists
              </v-subheader>
              <v-subheader v-else>
                Search Results
              </v-subheader>
              <v-divider></v-divider>

              <router-link v-for="(artist, index) in artists" :key="index" :to="{ name: 'artistoverview', params: { id: artist.id } }" class="link-white">
                <v-list-tile avatar class="list-item">
                  <v-list-tile-avatar >
                    <!-- TODO: if artist.images.length < 1 load in a default icon of a person -->
                    <v-img v-if="artist.images.length > 0" :src="artist.images[0].url">
                      <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </v-img>
                  </v-list-tile-avatar>
                  

                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{artist.name}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-if="artist.genres">
                      <span v-for="(genre, index) in artist.genres" :key="index"><span v-if="index > 0">, </span>{{genre}}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>
              </router-link>
            </v-list>
          </v-slide-y-transition>

          <p v-if="artists.length < 1 && endOfResults" class="pa-3">No search results.</p>
          <div v-if="loadingContent && !endOfResults" class="loader">
            <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
          </div>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchDirty: false,
      searchValue: '',
      searchOffset: 0,
      searchValidation: [
        (v) => !!v || 'Artist name is required'
      ],
      artists: [],
      loadingContent: false,
      endOfResults: false
    }
  },
  computed: {
    fetchedArtists() {
      return this.$store.getters.ARTISTS;
    },
    searchDisabled() {
      return this.searchValue.length < 1 ? true : false
    }
  },
  watch: {
    fetchedArtists() {
      this.loadingContent = false

      if (this.fetchedArtists.items.length > 0) {
        this.artists = this.artists.concat(this.fetchedArtists.items)
      } else {
        this.endOfResults = true
      }
    }
  },
  methods: {
    getTopArtists() {
      this.loadingContent = true

      this.$store.dispatch('getTopArtists', this.searchOffset)
      this.searchOffset = this.searchOffset + 20
    },
    getArtists() {
      this.loadingContent = true

      if (this.searchOffset === 0) { // If fetching first 20 results, I don't want to concat to existing array
        this.artists = [];
      }
      this.$store.dispatch('searchArtists', [this.searchValue, this.searchOffset])
      this.searchOffset = this.searchOffset + 20
    },
    search() {
      if (this.searchValue.length > 0) {
        
        this.searchDirty = true
        this.endOfResults = false
        this.searchOffset = 0
        this.getArtists()
      }
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

          if (this.searchDirty) {
            // get more search results
            this.getArtists()
          } else {
            // get more top artists
            this.getTopArtists()
          }
        }
      };
    }
  },
  created() {
    this.getTopArtists()
    this.$root.$emit('update:title', 'Artist Search')
  },
  mounted() {
    this.lazyLoad()
  }
}
</script>
<style>
.debug {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 200px;
  background-color: #000;
  z-index: 900;
}
</style>