<template>
  <div class="userTop">
    <v-layout row wrap>
      <v-flex xs12 md6 :class="{'pr-2': $vuetify.breakpoint.mdAndUp}">

        <v-card v-if="topTracks.length > 0">
          <v-card-title><h2>Top Songs</h2></v-card-title>

          <v-slide-y-transition>
            <v-list two-line>
              <v-subheader>
                Your Top Songs
              </v-subheader>
              <v-divider></v-divider>

              <router-link v-for="(track, index) in topTracks" :key="index" :to="{ name: 'albumdetails', params: { id: track.album.id } }" class="link-white">
                <v-list-tile avatar class="list-item">
                  <v-list-tile-avatar tile>
                    <v-img v-if="track.album.images.length > 0" :src="track.album.images[0].url">
                      <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </v-img>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{track.name}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{track.artists[0].name}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>
              </router-link>
            </v-list>
          </v-slide-y-transition>
        </v-card>

      </v-flex>
      <v-flex xs12 md6 pb-4 :class="{'pl-2': $vuetify.breakpoint.mdAndUp}">

        <v-card v-if="topArtists.length > 0">
          <v-card-title><h2>Top Artists</h2></v-card-title>

          <v-slide-y-transition>
            <v-list two-line>
              <v-subheader>
                Your Top Artists
              </v-subheader>
              <v-divider></v-divider>

              <router-link v-for="(artist, index) in topArtists" :key="index" :to="{ name: 'artistdetails', params: { id: artist.id } }" class="link-white">
                <v-list-tile avatar class="list-item">
                  <v-list-tile-avatar>
                    <v-img v-if="artist.images.length > 0" :src="artist.images[0].url">
                      <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </v-img>
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{artist.name}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-if="artist.genres">
                      <span v-for="(genre, index) in artist.genres" :key="index"><span v-if="index > 0">, </span>{{genre}}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>
              </router-link>
            </v-list>
          </v-slide-y-transition>
        </v-card>

      </v-flex>
    </v-layout>

    <div v-if="loadingContent" class="loader">
      <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'usertop',
  data() {
    return {
      topTracks: [],
      topArtists: [],
      loadingContent: false
    }
  },
  computed: {
    ...mapGetters({
      fetchedTopTracks: 'TOP_TRACKS',
      fetchedTopArtists: 'TOP_ARTISTS'
    })
  },
  watch: {
    fetchedTopTracks() {
      this.loadingContent = false
      this.topTracks = this.fetchedTopTracks.items
    },
    fetchedTopArtists() {
      this.loadingContent = false
      this.topArtists = this.fetchedTopArtists.items
    }
  },
  created() {
    this.loadingContent = true
    this.$store.dispatch('getUserTop', 'tracks')
    this.$store.dispatch('getUserTop', 'artists')
  }
}
</script>