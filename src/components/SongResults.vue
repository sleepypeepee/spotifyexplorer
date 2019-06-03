<template>
  <div class="songResults">

    <ResultsPanel :data="panelData" :preview="false" />

  </div>
</template>

<script>
import ResultsPanel from '@/components/ResultsPanel.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SongResults',
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
        results = this.searchResults.tracks
          
        if (results.items.length > 0) {
          results.type = 'tracks'
          results.title = 'Song'
          results.itemPath = 'albumdetails'
          results.resultsPath = '/search/songresults'

          for (var i = 0; i < results.items.length; i++) {
            results.items[i].images = results.items[i].album.images
          }
        }
      }
      return results
    }
  }
}
</script>