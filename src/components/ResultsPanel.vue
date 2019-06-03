<template>
	<v-card v-if="data">
		<v-card-title><h2>{{data.title}} Results</h2></v-card-title>

			<router-link 
				:to="{ name: data.itemPath, 
				params: { id: data.type === 'tracks' ? data.items[0].album.id : data.items[0].id } }" 
				class="link-white">
				<v-layout row wrap ma-0 class="list-item">
					<v-flex sm4 lg2 pa-3>

						<v-img v-if="data.items[0].images.length > 0" :src="data.items[0].images[0].url" aspect-ratio="1" class="black lighten-2" :class="{'avatar': data.type === 'artists'}">
							<v-layout slot="placeholder" fill-height align-center justify-center ma-0>
								<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
							</v-layout>
						</v-img>

					</v-flex>
					<v-flex sm8 lg10 py-3 pl-0 pr-3>

						<h2>{{data.items[0].name}}</h2>
						<h3 v-if="(data.type === 'tracks') || (data.type === 'albums')">{{data.items[0].artists[0].name}}</h3>

					</v-flex>
				</v-layout>
			</router-link>

			<v-list two-line v-if="data.items.length > 1">
				<v-divider></v-divider>

				<router-link 
					v-for="(item, index) in resultItems" 
					:key="index" 
					:to="{ name: data.itemPath, params: { id: data.type === 'tracks' ? item.album.id : item.id } }" 
					class="link-white">

					<v-list-tile avatar class="list-item">
						<v-list-tile-avatar :tile="data.type !== 'artists'">
							<v-img v-if="item.images.length > 0" :src="item.images[0].url">
								<v-layout slot="placeholder" fill-height align-center justify-center ma-0>
									<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
								</v-layout>
							</v-img>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>
								{{item.name}}
							</v-list-tile-title>
							<v-list-tile-sub-title v-if="(data.type === 'tracks') || (data.type === 'albums')">
								{{item.artists[0].name}}
							</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>

					<v-divider></v-divider>
				</router-link>
			</v-list>

		<v-card-actions v-if="data.items.length > 4 && preview">
			<v-btn :to="{name: data.resultsPath}" flat>View All</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default {
  name: 'ResultsPanel',
	props: {
		data: {
			type: Object
		},
		preview: {
			type: Boolean
		}
	},
	computed: {
		resultItems() {
			return this.preview ? this.data.items.slice(1, 4) : this.data.items
		}
	}
}

</script>