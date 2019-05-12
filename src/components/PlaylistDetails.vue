<template>
  <v-container class="playlistDetails" flex>
    <v-layout row>
      <v-flex pb-3>

        <v-card v-if="playlist">
          <v-layout row wrap>
            <v-flex xs12 sm4 md3 lg2>
              <div v-if="playlist.images.length > 0">
                 <v-img :src="playlist.images[0].url" :aspect-ratio="$vuetify.breakpoint.xsOnly ? 2.25 : 1" class="black lighten-2">
                   <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                 </v-img>
              </div>
            </v-flex>

            <v-flex xs12 sm8 md9 lg10 pa-3>
              <h1 class="font-weight-black" :class="{'display-2': $vuetify.breakpoint.mdAndUp, 'display-1': $vuetify.breakpoint.xsAndUp}">{{playlist.name}} (Playlist)</h1>
              <h2>{{playlist.description}}</h2>
              <p>{{playlist.tracks.total}} songs, {{totalAlbumLength | formatTimeToMin}}</p>
              <p class="mb-0">{{playlist.followers.total}} followers</p>
            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex pb-3>

        <v-slide-y-transition>
          <v-card v-if="tracks">
            <v-card-title><h2>Tracklist</h2></v-card-title>
              <v-list two-line>
                
                <a v-for="track in tracks.items" v-bind:href="track.href" :key="track.id" class="link-white" title="Play Track">
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
                          {{track.track.name}}
                        </v-list-tile-title>
                        <v-list-tile-sub-title v-if="track.track.artists.length > 0">
                          {{track.track.artists[0].name}}
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
export default {
  name: 'PlaylistDetails',
  data() {
    return {
      playlist: null,
      tracks: null,
      totalAlbumLength: 0
    }
  },
  computed: {
    returnedPlaylist() {
      return this.$store.getters.PLAYLIST
    },
    returnedTracks() {
      return this.$store.getters.TRACKS
    }
  },
  watch: {
    '$route': 'fetchPlaylistData',
    returnedPlaylist() {
      this.playlist = this.returnedPlaylist
      this.$root.$emit('update:title', this.playlist.name)
    },
    returnedTracks() {
      this.tracks = this.returnedTracks

      if(Array.isArray(this.returnedTracks.items)) {
        let total = 0;

        for (var i = 0; i < this.returnedTracks.items.length; i++) {
          total = total + this.returnedTracks.items[i].track.duration_ms;
        }
        this.totalAlbumLength = total
      }
    }
  },
  methods: {
    fetchPlaylistData() {
      // TODO: Loader
      this.$store.dispatch('getPlaylist', this.$route.params.id)
      this.$store.dispatch('getPlaylistTracks', this.$route.params.id)
    }
  },
  created() {
    this.fetchPlaylistData()
  }
}
</script>