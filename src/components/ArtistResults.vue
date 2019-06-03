<template>
  <div class="artistResults">

    <ResultsPanel :data="panelData" :preview="false" />

  </div>
</template>

<script>
import ResultsPanel from '@/components/ResultsPanel.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ArtistResults',
  components: {
    ResultsPanel
  },
  computed: {
    ...mapGetters({
      searchResults: 'SEARCH_RESULTS'
    }),
    panelData() {
      let results = {}

      if (this.searchResults !== null) {
        results = this.searchResults.artists
          
        if (results.items.length > 0) {
          results.type = 'artists'
          results.title = 'Artist'
          results.itemPath = 'artistdetails'
          results.resultsPath = '/search/artistresults'
        }
      }
      return results
    }
  }
}
</script>