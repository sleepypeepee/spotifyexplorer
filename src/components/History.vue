<template>
	<v-container class="search" flex>
    <v-layout v-if="$vuetify.breakpoint.mdAndDown" row>
      <v-flex pb-3>

        <h1 class="font-weight-black" :class="{'display-3': $vuetify.breakpoint.mdAndUp, 'display-2': $vuetify.breakpoint.smOnly, 'display-1': $vuetify.breakpoint.xsOnly}">History</h1>
        
       </v-flex>
     </v-layout>
     <v-layout row>
       <v-flex pb-4>

        <v-card>
          <v-slide-y-transition>
            <v-list two-line v-if="tracks.length > 0">
              <v-subheader>
                Your Recent Tracks
              </v-subheader>
              <v-divider></v-divider>

                <a v-for="(track, index) in tracks" 
                  @click="playTrack(index)" 
                  :key="index" 
                  class="link-white" 
                  title="Play Track">
                  <v-hover>
                    <v-list-tile slot-scope="{ hover }" avatar class="list-item" :class="{'active': track.track.id == currentTrackId}">
                      <v-list-tile-action>
                        <v-icon v-if="hover || (track.track.id == currentTrackId)" color="green">play_circle_filled</v-icon>
                        <v-icon v-else>music_note</v-icon>
                      </v-list-tile-action>

                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{track.track.name}}
                          <span class="right">{{track.track.duration_ms | formatTime}}</span>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{track.track.artists[0].name}}
                          <span class="caption right">{{track.played_at | formatTimeElapsed}} ago</span>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-hover>
                  
                  <v-divider></v-divider>
                </a>

            </v-list>
          </v-slide-y-transition>

          <p v-if="tracks.length < 1 && endOfResults" class="pa-3">No recent tracks.</p>
          <div class="loader" v-if="loadingContent">
            <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
          </div>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'History',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      tracks: [],
      offset: 0,
      loadingContent: false,
      endOfResults: false
    }
  },
  computed: {
    ...mapGetters({
      recentTracks: 'RECENTLY_PLAYED',
      currentTrack: 'CURRENT_TRACK'
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
    allTrackUris() {
      if (Array.isArray(this.tracks)) {
        let uris = [];
        for (var i = 0; i < this.tracks.length; i++) {
          uris.push(this.tracks[i].track.uri)
        }
        return uris
      }
    }
  },
  watch: {
    recentTracks() {
      this.loadingContent = false

      if (Array.isArray(this.recentTracks)) {
        if (this.recentTracks.length > 0) {
          this.tracks = this.getUnique(this.recentTracks) // Discard duplicate tracks in history
          this.endOfResults = true
        }
      }
    }
  },
  methods: {
    getRecentlyPlayed() {
      this.$store.dispatch('getRecentlyPlayed', this.offset)
      this.loadingContent = true
    },
    playTrack(offset) {
      this.$store.dispatch('playTrack', [null, this.allTrackUris, offset])

      let standardisedTracksArr = []
      for (var i = 0; i < this.tracks.length; i++) {
        standardisedTracksArr.push(this.tracks[i].track)
      }
      this.$store.dispatch('setCurrentTracks', standardisedTracksArr)
    },
    getUnique(arr) {
      let set = new Set();

      return arr.map((v, index) => { 
        if(set.has(v.track.id)) {
          return false
        } else {
          set.add(v.track.id);
          return index;
        } 
      }).filter(e=>e).map(e=>arr[e]);

    }
  },
  created() {
    this.getRecentlyPlayed()
    this.$root.$emit('update:title', 'History')
  }
}
</script>