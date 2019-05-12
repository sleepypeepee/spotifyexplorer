<template>
  <v-container class="library" flex>
    <v-layout row>
      <v-flex pb-3>

				<transition name="fade" mode="out-in">
					<router-view app></router-view>
				</transition>

			</v-flex>
    </v-layout>
</v-container>
</template>

<script>
export default {
  name: 'Library',
  created() {
    // this.$router.push('/library/userplaylists')
    this.$root.$emit('update:title', 'Library')
  }
}
</script>