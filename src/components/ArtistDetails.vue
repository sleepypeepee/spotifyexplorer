<template>
  <v-container>
    <v-layout>
      <v-flex xs12>

        <v-card v-if="artist">
          <v-card-title class="display-2 font-weight-black ">{{artist.name}}</v-card-title>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm3 pr-4>
               <v-img :src="artist.images[0].url" style="width: 100%;" aspect-ratio="1" class="grey lighten-2"></v-img>
              </v-flex>

              <v-flex sx12 sm9>
                <div v-if="albums !== undefined">
                  <h2>{{albums.items.length}} Albums</h2>
                </div>
                <p>{{artist.followers.total}} followers</p>
                <p><a v-bind:href="artist.external_urls.spotify" class="link-green" target="_blank">View on Spotify</a></p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

        <v-card>
          <v-card-title class="headline font-weight-regular">Albums</v-card-title>
          <v-container grid-list-sm fluid>
            <v-layout row wrap v-if="albums">
              <v-flex v-for="album in albums.items" :key="album.id" xs12 sm6 md3 d-flex pa-2 pb-4>

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
</template>

<script>
export default {
  name: 'ArtistDetails',
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