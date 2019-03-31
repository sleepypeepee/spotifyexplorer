<template>
  <v-container class="search">
    <v-layout>
      <v-flex xs12>

        <v-card>
          <v-card-title class="display-2 font-weight-black ">Search Artists</v-card-title>
          <v-container>
            <v-layout row wrap>
              <v-flex xs7 sm9 md10>
                <v-text-field
                  v-model="searchValue"
                  label="Enter artist name"
                  :rules="searchValidation"
                  required
                  outline
                  clearable
                  prepend-inner-icon="search"
                  v-on:keyup.enter="search"
                ></v-text-field>
              </v-flex>

              <v-flex xs5 sm3 md2>
                <v-btn depressed large :disabled="searchDisabled" v-on:click="search">Search</v-btn>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs12>

                <v-slide-y-transition>
                  <v-list two-line v-if="artists.length > 0" >
                    <v-subheader v-if="!searchDirty">
                      Your Top Artists
                    </v-subheader>
                    <v-subheader v-else>
                      Search Results
                    </v-subheader>
                    <v-divider></v-divider>

                    <router-link v-for="artist in artists" :key="artist.id" :to="{ name: 'artistdetails', params: { id: artist.id } }" class="link-green">
                      <v-list-tile avatar class="list-item">
                        <v-list-tile-avatar v-if="artist.images.length > 0">
                          <img :src="artist.images[0].url">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{artist.name}}
                          </v-list-tile-title>
                          <v-list-tile-sub-title v-if="artist.genres">
                            <span v-for="(genre, index) in artist.genres"><span v-if="index > 0">, </span>{{genre}}</span>
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-divider></v-divider>
                    </router-link>
                  </v-list>
                </v-slide-y-transition>
                <p v-if="artists.length < 1">No search results.</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchDirty: false,
      searchValue: '',
      searchValidation: [
        (v) => !!v || 'Artist name is required'
      ],
    }
  },
  computed: {
    artists() {
      return this.$store.getters.ARTISTS;
    },
    searchDisabled() {
      if (this.searchValue.length < 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    getDefaultContent() {
      this.$store.dispatch('getTopArtists')
    },
    search() {
      if (this.searchValue.length > 0) {
        this.searchDirty = true;
      }
      this.$store.dispatch('searchArtists', this.searchValue)
    }
  },
  mounted() {
    this.getDefaultContent()
  }
}
</script>