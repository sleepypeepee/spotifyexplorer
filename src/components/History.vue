<template>
	<v-container class="search" flex>
	<!-- <v-container class="search" fluid> -->
    <v-layout v-if="$vuetify.breakpoint.mdAndDown" row>
      <v-flex pb-3>

        <h1 class="font-weight-black" :class="{'display-3': $vuetify.breakpoint.mdAndUp, 'display-2': $vuetify.breakpoint.smOnly, 'display-1': $vuetify.breakpoint.xsOnly}">History</h1>
        
       </v-flex>
     </v-layout>
     <v-layout row>
       <v-flex pb-3>

        <v-card>
          <v-slide-y-transition>
            <v-list two-line v-if="tracks.length > 0">
              <v-subheader>
                Your Recent Tracks
              </v-subheader>
              <v-divider></v-divider>

                <a v-for="(track, index) in tracks" v-bind:href="track.track.href" :key="index" class="link-white" title="Play Track">
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
                          <span class="caption right">{{track.played_at | formatTimeElapsed}} ago</span>
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                          {{track.track.artists[0].name}}
                          <!-- {{track.track.duration_ms | formatTime}} -->
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>

                    <v-divider></v-divider>
                  </v-hover>
                </a>

            </v-list>
          </v-slide-y-transition>

          <p v-if="tracks.length < 1 && endOfResults">No recent tracks.</p>
          <div class="loader" v-if="loadingContent">
            <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
          </div>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
    recentTracks() {
      return this.$store.getters.RECENTLY_PLAYED;
    }
  },
  watch: {
    recentTracks() {
      this.loadingContent = false

      if(Array.isArray(this.recentTracks)) {
        if (this.recentTracks.length > 0) {
          this.tracks = this.recentTracks
          this.endOfResults = true
        }
      }
    }
  },
  methods: {
    getRecentlyPlayed() {
      this.$store.dispatch('getRecentlyPlayed', this.offset)
      this.loadingContent = true
    }
  },
  created() {
    this.getRecentlyPlayed()
    this.$root.$emit('update:title', 'History')
  }
}
</script>