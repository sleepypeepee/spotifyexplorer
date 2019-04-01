<template>
  <div class="albumDetails">
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>

          <v-card v-if="album">
            <v-container>
              <v-layout row wrap>
                <v-flex xs6 sm4 md3 pr-4 pb-4>
                 <v-img :src="album.images[0].url" style="width: 100%;" aspect-ratio="1" class="black lighten-2">
                   <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                 </v-img>
                </v-flex>

                <v-flex xs12 sm8 md9>
                  <h1 class="display-2 font-weight-black ">{{album.name}}</h1>
                  <router-link :to="{ name: 'artistdetails', params: { id: album.artists[0].id } }" class="link-green">
                    <h2>{{album.artists[0].name}}</h2>
                  </router-link>
                  <p>{{album.release_date | formatDateToYear}}</p>
                  <p>{{album.total_tracks}} songs</p>
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

          <v-slide-y-transition>
            <v-card v-if="tracks">
              <v-card-title class="headline font-weight-regular">Tracklist</v-card-title>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-list two-line>
                      <a v-for="track in tracks.items" v-bind:href="track.href" :key="track.id" class="link-green" title="Play Track">
                        <v-list-tile avatar class="list-item">
                          <v-list-tile-action>
                            <v-icon color="green">play_circle_filled</v-icon>
                          </v-list-tile-action>

                          <v-list-tile-content>
                            <v-list-tile-title>
                              {{track.track_number}}. {{track.name}}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              {{track.duration_ms | formatTime}}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>

                        <v-divider></v-divider>
                      </a>
                    </v-list>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-slide-y-transition>

        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AlbumDetails',
  computed: {
    album() {
      return this.$store.getters.ALBUM
    },
    tracks() {
      return this.$store.getters.TRACKS
    }
  },
  created() {
    this.fetchAlbumData()
  },
  watch: {
    '$route': 'fetchAlbumData'
  },
  methods: {
    fetchAlbumData() {
      // TODO: Loader
      this.$store.dispatch('getAlbum', this.$route.params.id)
      this.$store.dispatch('getTracks', this.$route.params.id)
    }
  }
}
</script>