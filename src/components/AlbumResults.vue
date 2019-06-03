<template>
  <div class="albumResults">

    <ResultsPanel :data="panelData" :preview="false" />

  </div>
</template>

<script>
import ResultsPanel from '@/components/ResultsPanel.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'AlbumResults',
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
        results = this.searchResults.albums
          
        if (results.items.length > 0) {
          results.type = 'albums'
          results.title = 'Album'
          results.itemPath = 'albumdetails'
          results.resultsPath = '/search/albumresults'
        }
      }
      return results
    }
  }
}
</script>