<template>
  <v-container class="library" flex>
    <v-layout row>
      <v-flex pb-4>

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
    this.$root.$emit('update:title', 'Library')
  }
}
</script>