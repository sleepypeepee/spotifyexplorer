<template>
  <div class="artistDetails">
  	<v-layout row>
      <v-flex pb-3>

        <h2>Albums</h2>

      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex pb-3>
        <v-container v-if="albums" grid-list-sm fluid pa-0>
          <v-layout v-if="albums.items.length > 0" row wrap>
            <v-flex v-for="album in orderBy(albums.items, 'release_date', -1)" :key="album.id" xs6 sm4 md3 lg2 d-flex pb-4>

              <v-card class="d-flex">
                <router-link :to="{ name: 'albumdetails', params: { id: album.id } }" class="link-white">
                  <v-img :src="album.images[0].url" aspect-ratio="1" class="black lighten-2">
                    <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </v-img>
                  <v-card-title class="pa-2 pb-3">
                    <div>
                      <div class="mb-0 caption">{{album.release_date | formatDateToYear}}</div>
                      <h3 class="mb-0 body-2">{{album.name}}</h3>
                    </div>
                  </v-card-title>
                </router-link>
              </v-card>
              
            </v-flex>
          </v-layout>

          <v-layout row wrap v-else>
            <p>No albums to show.</p>
          </v-layout>

        </v-container>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Vue2Filters from 'vue2-filters'

export default {
  name: 'ArtistOverview',
  mixins: [Vue2Filters.mixin],
  computed: {
    artist() {
      return this.$store.getters.ARTIST_DETAILS
    },
    albums() {      
      return this.$store.getters.ALBUMS
    }
  }
}
</script>