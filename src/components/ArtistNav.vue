<template>
  <v-tabs v-model="activeTab" :align-with-title="$vuetify.breakpoint.lgAndUp" :color="colorProp">
    <v-tabs-slider :color="sliderColor"></v-tabs-slider>
    <v-tab :to="{name: 'artistoverview'}">
      Overview
    </v-tab>
    <v-tab :to="{name: 'artistabout'}">
      About
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: 'ArtistNav',
  data() {
    return {
      activeTab: 'artistoverview'
    }
  },
  props: {
    colorProp: { type: String, required: false, default: 'transparent'},
    sliderColor: { type: String, required: false, default: 'white'}
  }
}
</script>