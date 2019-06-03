<template>
  <v-container class="search" flex>
    <v-layout row>
      <v-flex pb-3>

        <v-text-field
          v-model="searchValue"
          label="Song, artist, album, or playlist name"
          :rules="searchValidation"
          outline
          required
          clearable
          append-icon="search"
          @click:append="search"
          v-on:keyup.enter="search"
        ></v-text-field>

      </v-flex>
    </v-layout>

    <transition name="fade" mode="out-in">
      <router-view app></router-view>
    </transition>

  </v-container>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchValue: '',
      searchValidation: [
        (v) => !!v || 'Search term is required',
        (v) => /^[^*|":<>[\]{}`\\()';@&$]+$/.test(v) || 'Special characters not allowed'
      ]
    }
  },
  computed: {
    searchDisabled() {
      return this.searchValue.length < 1 ? true : false
    }
  },
  methods: {
    search() {
      if (this.searchValue.length > 0) {
        this.$router.push('/search/results')
        this.$store.dispatch('search', [this.searchValue, 'track,artist,album,playlist'])
      }
    }
  },
  created() {
    this.$root.$emit('update:title', 'Search')
  }
}
</script>