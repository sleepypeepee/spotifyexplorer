<template>
  <div class="artistDetails">
    <ArtistDetails />
  </div>
</template>

<script>
// @ is an alias to /src
import ArtistDetails from '@/components/ArtistDetails.vue'

export default {
  name: 'artistdetails',
  components: {
    ArtistDetails
  }
}
</script>
