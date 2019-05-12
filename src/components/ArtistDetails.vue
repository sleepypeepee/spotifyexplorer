<template>
  <v-container class="artistDetails" flex>
    <transition name="fade" mode="out-in">
      <v-layout v-if="showArtistCard" row>
        <v-flex pb-3>

          <v-card v-if="artist">
            <v-layout row wrap>
              <v-flex xs12 sm4 md3 lg2>
               <v-img :src="artist.images[0].url" :aspect-ratio="$vuetify.breakpoint.xsOnly ? 2.25 : 1" position="center 30%" class="black lighten-2">
                 <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-layout>
               </v-img>
              </v-flex>

              <v-flex xs12 sm8 md9 lg10 pa-3>
                <h1 class="font-weight-black" :class="{'display-2': $vuetify.breakpoint.mdAndUp, 'display-1': $vuetify.breakpoint.xsAndUp}">{{artist.name}}</h1>
                <div v-if="albums">
                  <h2>{{albums.items.length}} Albums</h2>
                </div>
                <p>{{artist.followers.total}} followers</p>
                <p class="mb-0"><a v-bind:href="artist.external_urls.spotify" class="link-green" target="_blank">View on Spotify</a></p>

              </v-flex>
            </v-layout>
          </v-card>

        </v-flex>
      </v-layout>
    </transition>
    <v-layout row>
      <v-flex pb-3>

        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue2Filters from 'vue2-filters'

export default {
  name: 'ArtistDetails',
  mixins: [Vue2Filters.mixin],
  computed: {
    artist() {
      return this.$store.getters.ARTIST_DETAILS
    },
    albums() {      
      return this.$store.getters.ALBUMS
    },
    showArtistCard() {
      return (this.$route.name == 'artistoverview' && this.$vuetify.breakpoint.mdAndDown) || this.$vuetify.breakpoint.lgAndUp ? true : false
    }
  },
  created() {
    this.fetchArtistData()
  },
  watch: {
    '$route': 'fetchArtistData',
    artist() {
      this.$root.$emit('update:title', this.artist.name)
    }
  },
  methods: {
    fetchArtistData() {
      // TODO: Loader
      this.$store.dispatch('getArtist', this.$route.params.id)
      this.$store.dispatch('getAlbums', [this.$route.params.id, 'album'])
    }
  }
}
</script>