<template>
  <v-card class="userArtists" v-if="artists">

    <v-slide-y-transition>
      <v-list v-if="artists.length > 0" two-line>
        <v-subheader>
          My Followed Artists
        </v-subheader>
        <v-divider></v-divider>

        <router-link v-for="artist in orderBy(artists, 'name')" :key="artist.id" :to="{ name: 'artistdetails', params: { id: artist.id } }" class="link-white">
          <v-list-tile avatar class="list-item">
            <v-list-tile-avatar >
              <!-- TODO: if artist.images.length < 1 load in a default icon -->
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

    <p v-if="artists.length < 1 && endOfResults" class="pa-3">No artists available.</p>
    <div class="loader" v-if="loadingContent">
      <v-progress-circular class="listProgress" :size="70" indeterminate color="grey lighten-5"></v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'UserArtists',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      artists: [],
      loadingContent: false,
      endOfResults: false
    }
  },
  computed: {
    ...mapGetters({
      fetchedArtists: 'USER_ARTISTS'
    })
  },
  watch: {
    fetchedArtists() {
      this.loadingContent = false;

      if(Array.isArray(this.fetchedArtists)) {
        if (this.fetchedArtists.length > 0) {
          this.artists = this.fetchedArtists;
        } else {
          this.endOfResults = true
        }
      }
    }
  },
  methods: {
    getArtists() {
      this.$store.dispatch('getUserArtists')
      this.loadingContent = true
    }
  },
  created() {
    this.getArtists()
  }
}
</script>