<template>
  <div class="artistDetails">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>

          <v-card v-if="artist">
            <v-container>
              <v-layout row wrap>
                <v-flex xs6 sm4 md3 pr-4 pb-4>
                 <v-img :src="artist.images[0].url" style="width: 100%;" aspect-ratio="1" class="black lighten-2">
                   <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                 </v-img>
                </v-flex>

                <v-flex xs12 sm8 md9>
                  <h1 class="display-2 font-weight-black ">{{artist.name}}</h1>
                  <div v-if="albums">
                    <h2>{{albums.items.length}} Albums</h2>
                  </div>
                  <p>{{artist.followers.total}} followers</p>
                  <p><a v-bind:href="artist.external_urls.spotify" class="link-green" target="_blank">View on Spotify</a></p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <v-layout row wrap>
        <v-flex xs12>

          <v-card>
            <v-card-title class="headline font-weight-regular">Albums</v-card-title>
            <v-container grid-list-sm fluid>
              <v-layout row wrap v-if="albums">
                <v-flex v-for="album in orderBy(albums.items, 'release_date', -1)" :key="album.id" xs6 sm4 md3 lg2 d-flex pa-2 pb-4>

                  <v-card flat tile class="d-flex">
                    <router-link :to="{ name: 'albumdetails', params: { id: album.id } }" class="link-green">
                      <v-img :src="album.images[0].url" aspect-ratio="1" class="black lighten-2">
                        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </v-img>
                      <div class="album-image-title">
                        <p>{{album.release_date | formatDateToYear}}</p>
                        <h3>{{album.name}}</h3>
                      </div>
                    </router-link>
                  </v-card>
                  
                </v-flex>
              </v-layout>
              <v-layout row wrap v-else>
                <p>No albums to show.</p>
              </v-layout>
            </v-container>
          </v-card>

        </v-flex>
      </v-layout>
    </v-container>
  </div>
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
    }
  },
  created() {
    this.fetchArtistData()
  },
  watch: {
    '$route': 'fetchArtistData'
  },
  methods: {
    fetchArtistData() {
      // TODO: Loader
      this.$store.dispatch('getArtist', this.$route.params.id)
      this.$store.dispatch('getAlbums', this.$route.params.id)
    }
  }
}
</script>
<style>
.album-image-title { 
  padding: 10px 0;
}
.album-image-title p { 
  margin-bottom: 0;
  color: #fff;
}
</style>