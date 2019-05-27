<template>
  <v-container class="playlistDetails" flex>
    <v-layout row>
      <v-flex pb-3>

        <v-card v-if="playlist">
          <v-layout row wrap>
            <v-flex xs12 sm4 md3 lg2>

              <v-hover>
                <a slot-scope="{ hover }" @click="playTrack(0)">
                  <v-img v-if="playlist.images.length > 0" :src="playlist.images[0].url" :aspect-ratio="$vuetify.breakpoint.xsOnly ? 2.25 : 1" class="black lighten-2">
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
              <h1 class="font-weight-black" :class="{'display-2': $vuetify.breakpoint.mdAndUp, 'display-1': $vuetify.breakpoint.xsAndUp}">{{playlist.name}} (Playlist)</h1>
              <h2>{{playlist.description | limitString(90)}}</h2>
              <p>{{playlist.followers.total.toLocaleString()}} followers • {{playlist.tracks.total}} songs, {{totalAlbumLength | formatTimeToMin}}</p>
              <v-hover>
                <a slot-scope="{ hover }" @click="toggleFavorite()">
                  <v-icon v-if="isFavPlaylist" color="green">favorite</v-icon>
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
          <v-card v-if="tracks">
            <v-card-title><h2>Tracklist</h2></v-card-title>
            <v-list two-line>
              
            <div v-for="(track, index) in tracks">
              <a v-if="track.track.is_playable" @click="playTrack(index)" :key="track.id" class="link-white">
                <v-hover>
                  <v-list-tile slot-scope="{ hover }" avatar class="list-item" :class="{'active': track.track.id == currentTrackId}">
                    <v-list-tile-action >
                      <v-icon v-if="hover || (track.track.id == currentTrackId)" color="green">play_circle_filled</v-icon>
                      <v-icon v-else>music_note</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{track.track.name}}
                        <span class="right">{{track.track.duration_ms | formatTime}}</span>
                      </v-list-tile-title>
                      <v-list-tile-sub-title v-if="track.track.artists.length > 0">
                        {{track.track.artists[0].name}}
                        <span class="caption right">
                          Added {{track.added_at | formatTimeElapsed}} ago by 
                          <span class="font-weight-bold">{{track.added_by.id === '' ? 'Spotify' : track.added_by.id}}</span>
                        </span>
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
                    {{track.track.name}}
                    <span class="right">{{track.track.duration_ms | formatTime}}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title v-if="track.track.artists.length > 0">
                    {{track.track.artists[0].name}}
                    <span class="caption right">
                      Added {{track.added_at | formatTimeElapsed}} ago by 
                      <span class="font-weight-bold">{{track.added_by.id === '' ? 'Spotify' : track.added_by.id}}</span>
                    </span>
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
  name: 'PlaylistDetails',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      playlist: null,
      tracks: null,
      isFavPlaylist: false
    }
  },
  computed: {
    ...mapGetters({
      fetchedPlaylist: 'PLAYLIST',
      currentTrack: 'CURRENT_TRACK',
      user: 'USER'
    }),
    currentTrackId() {
      let id = ''
      if (this.currentTrack) {
        if (this.currentTrack.linked_from.id !== null) {
          id = this.currentTrack.linked_from.id
        } else {
          id = this.currentTrack.id
        }
      }
      return id
    },
    totalAlbumLength() {
      let total = 0
      for (var i = 0; i < this.fetchedPlaylist.tracks.items.length; i++) {
        total = total + this.fetchedPlaylist.tracks.items[i].track.duration_ms
      }
      return total
    }
  },
  watch: {
    '$route': 'fetchPlaylistData',
    fetchedPlaylist() {
      this.playlist = this.fetchedPlaylist
      this.tracks = this.fetchedPlaylist.tracks.items
      this.$root.$emit('update:title', this.playlist.name)
    }
  },
  methods: {
    fetchPlaylistData() {
      this.$store.dispatch('getPlaylist', this.$route.params.id)
    },
    playTrack(index) {
      this.$store.dispatch('playTrack', [this.playlist.uri, null, index])
    },
    toggleFavorite() {
      if (!this.isFavPlaylist) {
        spotifyApi.put('/playlists/' + this.$route.params.id + '/followers', {'public': false})
          .then(res =>  {
            if (res.status === 200) {
              this.isFavPlaylist = !this.isFavPlaylist
            }
            // TODO: Error object handling
          });

      } else {
        spotifyApi.delete('/playlists/' + this.$route.params.id + '/followers')
          .then(res =>  {
            if (res.status === 200) {
              this.isFavPlaylist = !this.isFavPlaylist
            }
            // TODO: Error object handling
          });
      }
    }
  },
  created() {
    this.fetchPlaylistData()
    spotifyApi.get('/playlists/' + this.$route.params.id + '/followers/contains?&ids=' + this.user.id)
      .then(res =>  this.isFavPlaylist = res.data[0]);
      // TODO: Error object handling
  }
}
</script>