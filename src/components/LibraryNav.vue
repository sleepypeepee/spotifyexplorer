<template>
  <v-tabs v-model="activeTab" :color="colorProp">
    <v-tabs-slider :color="sliderColor"></v-tabs-slider>
    <v-tab to="userplaylists">
      Playlists
    </v-tab>
    <v-tab to="useralbums">
      Albums
    </v-tab>
    <v-tab to="userartists">
      Artists
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: 'LibraryNav',
  data() {
    return {
      activeTab: '/library'
    }
  },
  props: {
    colorProp: { type: String, required: false, default: 'transparent'},
    sliderColor: { type: String, required: false, default: 'green'}
  }
}
</script>