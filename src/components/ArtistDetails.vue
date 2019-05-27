<template>
  <v-container class="artistDetails" flex>
    <transition name="fade" mode="out-in">
      <v-layout v-if="showArtistCard" row>
        <v-flex pb-3>

          <v-card v-if="artist">
            <v-layout row wrap>
              <v-flex xs12 sm4 md3 lg2>

            <!-- TODO: Placeholder image -->
            <v-img v-if="artist.images.length > 0" :src="artist.images[0].url" :aspect-ratio="$vuetify.breakpoint.xsOnly ? 2.25 : 1" position="center 30%" class="black lighten-2">
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
                <p>{{artist.followers.total.toLocaleString()}} followers</p>
                <v-hover>
                  <a slot-scope="{ hover }" @click="toggleFavorite()">
                    <v-icon v-if="isFavArtist" color="green">favorite</v-icon>
                    <v-icon v-else :color="hover ? 'grey lighten-2' : 'grey'">favorite_border</v-icon>
                  </a>
                </v-hover>

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
import { mapGetters } from 'vuex'
import spotifyApi from '../gateways/spotifyApi'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'ArtistDetails',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      artist: null,
      albums: null,
      isFavArtist: false
    }
  },
  computed: {
    ...mapGetters({
      fetchedArtist: 'ARTIST_DETAILS',
      fetchedAlbums: 'ALBUMS',
    }),
    showArtistCard() {
      return (this.$route.name == 'artistoverview' && this.$vuetify.breakpoint.mdAndDown) || this.$vuetify.breakpoint.lgAndUp ? true : false
    }
  },
  watch: {
    '$route': 'fetchArtistData',
    fetchedArtist() {
      this.artist = this.fetchedArtist
      this.$root.$emit('update:title', this.artist.name)
    },
    fetchedAlbums() {
      this.albums = this.fetchedAlbums
    }
  },
  methods: {
    fetchArtistData() {
      this.$store.dispatch('getArtist', this.$route.params.id)
      this.$store.dispatch('getAlbums', [this.$route.params.id, 'album'])
    },
    toggleFavorite() {
      if (!this.isFavArtist) {
        spotifyApi.put('/me/following?type=artist&ids=' + this.$route.params.id, null)
          .then(res =>  {
            if (res.status === 204) {
              this.isFavArtist = !this.isFavArtist
            }
            // TODO: Error object handling
          });

      } else {
        spotifyApi.delete('/me/following?type=artist&ids=' + this.$route.params.id)
          .then(res =>  {
            if (res.status === 204) {
              this.isFavArtist = !this.isFavArtist
            }
            // TODO: Error object handling
          });
      }
    }
  },
  created() {
    this.fetchArtistData()
    spotifyApi.get('/me/following/contains?type=artist&ids=' + this.$route.params.id)
      .then(res =>  this.isFavArtist = res.data[0]);
      // TODO: Error object handling
  }
}
</script>