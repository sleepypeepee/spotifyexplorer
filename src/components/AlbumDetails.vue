<template>
  <v-container class="albumDetails" flex>
    <v-layout row>
      <v-flex pb-3>

        <v-card v-if="album">
          <v-layout row wrap>
            <v-flex xs12 sm4 md3 lg2>
             <v-img v-if="album.images.length > 0" :src="album.images[0].url" :aspect-ratio="$vuetify.breakpoint.xsOnly ? 2.25 : 1" position="center 30%" class="black lighten-2">
               <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
             </v-img>
            </v-flex>

            <v-flex xs12 sm8 md9 lg10 pa-3>
              <h1 class="font-weight-black" :class="{'display-2': $vuetify.breakpoint.mdAndUp, 'display-1': $vuetify.breakpoint.xsAndUp}">{{album.name}}</h1>
              <router-link v-if="album.artists.length > 0" :to="{ name: 'artistoverview', params: { id: album.artists[0].id } }" class="link-green">
                <h2>{{album.artists[0].name}}</h2>
              </router-link>
              <p>{{album.release_date | formatDateToYear}}</p>
              <p class="mb-0">{{album.total_tracks}} songs, {{totalAlbumLength | formatTimeToMin}}</p>
            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex pb-3>

        <v-slide-y-transition>
          <v-card v-if="tracks && numDiscs > 0">
            <v-card-title><h2>Tracklist</h2></v-card-title>
              <v-list v-for="index in numDiscs" :key="index" two-line>
                <v-subheader v-if="numDiscs > 1">
                  Disc {{index}}
                </v-subheader>
                
                <a v-for="track in filterBy(tracks.items, index, 'disc_number')" v-bind:href="track.href" :key="track.id" class="link-white" title="Play Track">
                  <v-hover>
                    <v-list-tile slot-scope="{ hover }" avatar class="list-item">
                      <v-list-tile-action v-if="hover">
                        <v-icon color="green">play_circle_filled</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-action v-else>
                        <v-icon>music_note</v-icon>
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
                  </v-hover>
                </a>
              </v-list>
          </v-card>
        </v-slide-y-transition>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue2Filters from 'vue2-filters'

export default {
  name: 'AlbumDetails',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      album: {
        artists: [],
        images: []
      },
      totalAlbumLength: 0
    }
  },
  computed: {
    fetchedAlbum() {
      return this.$store.getters.ALBUM
    },
    tracks() {
      return this.$store.getters.TRACKS
    },
    numDiscs() {
      let number = 0;

      if (Array.isArray(this.tracks.items)) {
        for (var i = 0; i < this.tracks.items.length; i++) {
          if (this.tracks.items[i].disc_number > number) {
            number = this.tracks.items[i].disc_number;
          }
        }
      }
      return number;
    }
  },
  watch: {
    '$route': 'fetchAlbumData',
    fetchedAlbum() {
      this.album = this.fetchedAlbum
      this.$root.$emit('update:title', this.album.name)
    },
    tracks() {
      if (Array.isArray(this.tracks.items)) {
        let total = 0;

        for (var i = 0; i < this.tracks.items.length; i++) {
          total = total + this.tracks.items[i].duration_ms;
        }
        this.totalAlbumLength = total
      }
    }
  },
  methods: {
    fetchAlbumData() {
      // TODO: Loader
      this.$store.dispatch('getAlbum', this.$route.params.id)
      this.$store.dispatch('getTracks', this.$route.params.id)
    }
  },
  created() {
    this.fetchAlbumData()
  }
}
</script>