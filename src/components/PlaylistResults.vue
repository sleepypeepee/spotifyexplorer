<template>
  <div class="playlistResults">

    <ResultsPanel :data="panelData" :preview="false" />

  </div>
</template>

<script>
import ResultsPanel from '@/components/ResultsPanel.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PlaylistResults',
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
        results = this.searchResults.playlists
          
        if (results.items.length > 0) {
          results.type = 'playlists'
          results.title = 'Playlist'
          results.itemPath = 'playlistdetails'
          results.resultsPath = '/search/playlistresults'
        }
      }
      return results
    }
  }
}
</script>