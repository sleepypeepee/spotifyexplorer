<template>
  <v-container v-if="panelData" grid-list-lg fluid pa-0 class="results">
    <v-layout row wrap>
      <v-flex xs12 md6 v-if="panelData.tracks.items.length > 0">

        <ResultsPanel :data="panelData.tracks" :preview="true" />

      </v-flex>
      <v-flex xs12 md6 v-if="panelData.artists.items.length > 0">

        <ResultsPanel :data="panelData.artists" :preview="true" />

      </v-flex>
      <v-flex xs12 md6 v-if="panelData.albums.items.length > 0">

        <ResultsPanel :data="panelData.albums" :preview="true" />

      </v-flex>
      <v-flex xs12 md6 v-if="panelData.playlists.items.length > 0">

        <ResultsPanel :data="panelData.playlists" :preview="true" />

      </v-flex>

      <p v-if="resultTypeAmt < 1" class="pl-3">No search results.</p>
    </v-layout>
  </v-container>
</template>

<script>
import ResultsPanel from '@/components/ResultsPanel.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Results',
  components: {
    ResultsPanel
  },
  data() {
    return {
      loadingContent: false
    }
  },
  computed: {
    ...mapGetters({
      searchResults: 'SEARCH_RESULTS'
    }),
    panelData() {
      let results = null

      if (this.searchResults !== null) {
        results = this.searchResults

        Object.keys(results).forEach((item) => {
					if (results[item].items.length > 0) {
						results[item].type = item
						results[item].title = item === 'tracks' ? 'Song' : item.charAt(0).toUpperCase() + item.slice(1,-1)
            results[item].itemPath = item === 'tracks' ? 'albumdetails' : item.slice(0,-1) + 'details'
						results[item].resultsPath = item === 'tracks' ? 'songresults' : item.slice(0,-1) + 'results'

						if (item === 'tracks') {
							for (var i = 0; i < results[item].items.length; i++) {
								results[item].items[i].images = results[item].items[i].album.images
							}
						}
					}
				});
      }
			return results
    },
    resultTypeAmt() {
      var amount = 0
      if (Array.isArray(this.searchResults.tracks.items)) {
        Object.keys(this.searchResults).forEach((item) => {
					if (this.searchResults[item].items.length > 0) {
						amount++
					}
				});
      }
			return amount
    }
  }
}
</script>