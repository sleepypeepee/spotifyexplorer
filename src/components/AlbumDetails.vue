<template>
  <v-container class="albumDetails" flex>
    <v-layout row>
      <v-flex pb-3>

        <v-card v-if="album">
          <v-layout row wrap>
            <v-flex xs12 sm4 md3 lg2>

              <v-hover>
                <a slot-scope="{ hover }" @click="playTrack(0)">
                  <v-img v-if="album.images.length > 0" :src="album.images[0].url" :aspect-ratio="$vuetify.breakpoint.xsOnly ? 2.25 : 1" position="center 30%" class="black lighten-2">
                    <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                    <v-fade-transition>
                      <v-layout v-if="hover" fill-height align-center justify-center ma-0 class="overlay">
                        <v-icon size="90">play_circle_outline</v-icon>
                      </v-layout>
                    </v-fade-transition>
                  </v-img>
                </a>
              </v-hover>

            </v-flex>
            <v-flex xs12 sm8 md9 lg10 pa-3>

              <h1 class="font-weight-black" :class="{'display-2': $vuetify.breakpoint.mdAndUp, 'display-1': $vuetify.breakpoint.xsAndUp}">{{album.name}}</h1>
              <div v-if="album.artists.length > 0">
                <router-link v-if="!isVariousArtists" :to="{ name: 'artistoverview', params: { id: album.artists[0].id } }" class="link-green">
                  <h2>{{album.artists[0].name}}</h2>
                </router-link>
                <h2 v-else>{{album.artists[0].name}}</h2>
              </div>
              <p>{{album.release_date | formatDateToYear}} • {{album.total_tracks}} songs, {{totalAlbumLength | formatTimeToMin}}</p>
              <v-hover>
                <a slot-scope="{ hover }" @click="toggleFavorite()">
                  <v-icon v-if="isFavAlbum" color="green">favorite</v-icon>
                  <v-icon v-else :color="hover ? 'grey lighten-2' : 'grey'">favorite_border</v-icon>
                </a>
              </v-hover>

            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex pb-4>

        <v-slide-y-transition>
          <v-card v-if="tracks && numDiscs > 0">
            <v-card-title><h2>Tracklist</h2></v-card-title>
            <v-list v-for="index in numDiscs" :key="index" two-line>
              
              <v-subheader v-if="numDiscs > 1">
                Disc {{index}}
              </v-subheader>
              
              <div v-for="(track, index) in filterBy(tracks.items, index, 'disc_number')">
                <a v-if="track.is_playable" @click="playTrack(index)" :key="track.id" class="link-white">
                  <v-hover>
                    <v-list-tile slot-scope="{ hover }" avatar class="list-item" :class="{'active': track.id == currentTrackId}">
                      <v-list-tile-action>
                        <v-icon v-if="hover || (track.id == currentTrackId)" color="green">play_circle_filled</v-icon>
                        <v-icon v-else>music_note</v-icon>
                      </v-list-tile-action>

                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{track.track_number}}. {{track.name}}
                          <span class="right">{{track.duration_ms | formatTime}}</span>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{track.artists[0].name}}
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-hover>

                  <v-divider></v-divider>
                </a>
                <v-list-tile v-else avatar class="list-item unavailable">
                  <v-list-tile-action>
                    <v-icon color="grey">music_note</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{track.track_number}}. {{track.name}}
                      <span class="right">{{track.duration_ms | formatTime}}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{track.artists[0].name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>
              </div>

            </v-list>
          </v-card>
        </v-slide-y-transition>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import spotifyApi from '../gateways/spotifyApi'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'AlbumDetails',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      album: null,
      tracks: null,
      isFavAlbum: false
    }
  },
  computed: {
    ...mapGetters({
      fetchedAlbum: 'ALBUM',
      currentTrack: 'CURRENT_TRACK'
    }),
    currentTrackId () {
      let id = ''
      if (this.currentTrack) {
        if (this.currentTrack.id !== null) {
          id = this.currentTrack.id
        } else {
          id = this.currentTrack.linked_from.id
        }
      }
      return id
    },
    totalAlbumLength() {
      let total = 0;
      for (var i = 0; i < this.fetchedAlbum.tracks.items.length; i++) {
        total = total + this.fetchedAlbum.tracks.items[i].duration_ms;
      }
      return total
    },
    numDiscs() {
      let number = 0;
      if (Array.isArray(this.fetchedAlbum.tracks.items)) {
        for (var i = 0; i < this.fetchedAlbum.tracks.items.length; i++) {
          if (this.fetchedAlbum.tracks.items[i].disc_number > number) {
            number = this.fetchedAlbum.tracks.items[i].disc_number;
          }
        }
      }
      return number
    },
    isVariousArtists() {
      let isVarious = false
      if (Array.isArray(this.fetchedAlbum.artists)) {
        isVarious = this.fetchedAlbum.artists[0].name == 'Various Artists' ? true : false
      }
      return isVarious
    }
  },
  watch: {
    '$route': 'fetchAlbumData',
    fetchedAlbum() {
      this.album = this.fetchedAlbum
      this.tracks = this.fetchedAlbum.tracks
      this.$root.$emit('update:title', this.album.name)
    }
  },
  methods: {
    fetchAlbumData() {
      // TODO: Loader
      this.$store.dispatch('getAlbum', this.$route.params.id)
    },
    playTrack(offset) {
      this.$store.dispatch('playTrack', [this.album.uri, null, offset])
    },
    toggleFavorite() {
      if (!this.isFavAlbum) {
        spotifyApi.put('/me/albums?ids=' + this.$route.params.id, null)
          .then(res =>  {
            if (res.status === 200) {
              this.isFavAlbum = !this.isFavAlbum
            }
            // TODO: Error object handling
          });

      } else {
        spotifyApi.delete('/me/albums?ids=' + this.$route.params.id)
          .then(res =>  {
            if (res.status === 200) {
              this.isFavAlbum = !this.isFavAlbum
            }
            // TODO: Error object handling
          });
      }
    }
  },
  created() {
    this.fetchAlbumData()
    spotifyApi.get('/me/albums/contains?type=artist&ids=' + this.$route.params.id)
      .then(res =>  this.isFavAlbum = res.data[0]);
      // TODO: Error object handling
  }
}
</script>