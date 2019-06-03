<template>
	<div class="player" :class="{'mobile': $vuetify.breakpoint.mdAndDown}">

		<v-fade-transition>
			<div v-show="playlistVisible" class="currentTracklist grey darken-4">
				<v-btn fab icon @click="togglePlaylist" class="closeBtn">
					<v-icon x-large>keyboard_arrow_down</v-icon>
				</v-btn>

				<v-container fluid>
					<v-layout row wrap>
						<v-flex xs12>

							<v-card flat class="grey darken-4">
								<v-card-title><h2>Now Playing</h2></v-card-title>

								<v-list v-if="tracks.length > 0" two-line class="grey darken-4">
									<div v-for="(track, index) in tracks" :key="index">
										<a v-if="track.is_playable || !track.hasOwnProperty('is_playable')" @click="playTrack(index)" class="link-white">
											<v-hover>
												<v-list-tile slot-scope="{ hover }" avatar class="list-item" :class="{'active': track.id == currentTrackId}">
													<v-list-tile-action>
														<v-icon v-if="hover || (track.id == currentTrackId)" color="green">play_circle_filled</v-icon>
														<v-icon v-else>music_note</v-icon>
													</v-list-tile-action>

													<v-list-tile-content>
														<v-list-tile-title>
															{{track.name}}
															<span class="right">{{track.duration_ms | formatTime}}</span>
														</v-list-tile-title>
														<v-list-tile-sub-title>
															{{track.artists[0].name}}
														</v-list-tile-sub-title>
													</v-list-tile-content>
												</v-list-tile>
											</v-hover>

											<v-divider></v-divider>
										</a>
									</div>
								</v-list>

								<p v-if="tracks.length < 1" class="pa-3">No tracks selected.</p>
							</v-card>

						</v-flex>
					</v-layout>
				</v-container>
			</div>
		</v-fade-transition>

		<v-toolbar flat height=80 class="playerBar black">
			
			<div class="trackInfo">
				<v-fade-transition>
					<v-layout v-if="currentTrack" row align-center>
						<v-flex xs3>
							
							<router-link :to="{ name: 'albumdetails', params: { id: albumId } }" class="link-white">
								<v-img v-if="currentTrack.album.images.length > 0" @click="closePlaylist" :src="currentTrack.album.images[0].url" height=80 width=80>
									<v-layout slot="placeholder" fill-height align-center justify-center ma-0>
										<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
									</v-layout>
								</v-img>
							</router-link>

						</v-flex>
						<v-flex xs9>
				
							<div><strong>{{currentTrack.name | limitString(50)}}</strong></div>
							<div>
								<router-link :to="{ name: 'albumdetails', params: { id: albumId } }" class="link-white">
									<span @click="closePlaylist">{{currentTrack.album.name | limitString(50)}}</span>
								</router-link>
							</div>
							<div class="caption">
								<router-link :to="{ name: 'artistdetails', params: { id: artistId } }" class="link-white">
									<span @click="closePlaylist">{{currentTrack.artists[0].name | limitString(50)}}</span>
								</router-link>
							</div>

						</v-flex>
					</v-layout>
				</v-fade-transition>
			</div>

      <v-btn :disabled="controlsDisabled" flat icon @click="toggleShuffle" :class="{'green': shuffle}">
				<v-icon>shuffle</v-icon>
			</v-btn>

      <v-btn :disabled="controlsDisabled" outline fab small @click="skipTrack('previous')">
				<v-icon>skip_previous</v-icon>
			</v-btn>
      <v-btn v-if="!isPlaying" :disabled="controlsDisabled" outline fab @click="togglePlayback">
        <v-icon large>play_arrow</v-icon>
      </v-btn>
      <v-btn v-if="isPlaying" :disabled="controlsDisabled" outline fab @click="togglePlayback">
        <v-icon>pause</v-icon>
      </v-btn>
      <v-btn :disabled="controlsDisabled" outline fab small @click="skipTrack('next')">
				<v-icon>skip_next</v-icon>
			</v-btn>

      <v-btn :disabled="controlsDisabled" flat icon @click="toggleLoop" :class="{'green': loop.active}">
				<v-icon v-if="loop.state === 'off' || loop.state === 'context'">repeat</v-icon>
				<v-icon v-else>repeat_one</v-icon>
			</v-btn>

      <v-spacer></v-spacer>

      <v-btn fab small @click="togglePlaylist" :class="{'green': playlistVisible}">
				<v-icon>list</v-icon>
			</v-btn>

			<v-spacer></v-spacer>

			<v-menu open-on-hover top offset-y>
        <template v-slot:activator="{ on }">
          <v-btn fab small v-on="on" :class="{'green': deviceConnected}" :disabled="devices.length < 2">
            <v-icon>devices</v-icon>
          </v-btn>
        </template>
        <v-list v-if="devices.length > 0 && activeDevice">
          <v-list-tile v-for="(device, i) in devices" :key="i" @click="transferPlayback(device.id)" :class="{'green': device.id === activeDevice.id}">
            <v-list-tile-title>{{ device.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'Player',
	data() {
		return {
			player: {},
			isPlaying: false,
			currentTrack: null,
			deviceId: null,
			albumId: null,
			artistId: null,
			shuffle: false,
			loop: {
				active: false,
				state: 'off'
			},
			playlistVisible: false,
			tracks: [],
			devices: [],
			controlsDisabled: true
		}
  },
  computed: {
    ...mapGetters({
      currentTracks: 'CURRENT_TRACKS',
      fetchedDevices: 'DEVICES'
    }),
    currentTrackId () {
			let trackId = ''

      if (this.currentTrack) {
        if (this.currentTrackid !== null) {
          trackId = this.currentTrack.id
        } else {
          trackId = this.currentTrack.linked_from.id
        }
      }
      return trackId
    },
    deviceConnected() {
			let isConnected = false

			if (Array.isArray(this.fetchedDevices)) {
				if (this.fetchedDevices.length > 1) {
					isConnected = true
				}
			}
			return isConnected
    },
    activeDevice () {
			let device = null

			if (this.fetchedDevices) {
				for (var i = 0; i < this.fetchedDevices.length; i++) {
					if (this.fetchedDevices[i].is_active) {
						device = this.fetchedDevices[i]
					}
				}
			}
			return device;
    }
  },
  watch: {
		currentTracks() {
			this.tracks = this.currentTracks
		},
		fetchedDevices() {
			this.devices = this.fetchedDevices
		},
		playlistVisible() {
			setTimeout(()=> {
				this.scrollToActiveItem()
			}, 10)
		},
		activeDevice() {
			this.controlsDisabled = this.deviceId == this.activeDevice.id ? false: true
		}
  },
	methods: {
		waitForSpotifyWebPlaybackSDKToLoad: async function () {
			return new Promise(resolve => {
				if (window.Spotify) {
					resolve(window.Spotify)
				} else {
					window.onSpotifyWebPlaybackSDKReady = () => {
						resolve(window.Spotify)
					}
				}
			})
    },
    initiatePlayer: async function () {
			const token = this.$store.state.token
      const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad()
      const sdk = new Player({
        name: 'Spotify Explorer',
        volume: 1.0,
        getOAuthToken: callback => { callback(token) }
      })
      // Error handling
      sdk.addListener('initialization_error', ({ message }) => { console.log('Initialization_error: ' + message) })
      sdk.addListener('authentication_error', ({ message }) => { console.log('Authentication_error: ' + message) })
      sdk.addListener('account_error', ({ message }) => { console.log('Account_error: ' + message) })
      sdk.addListener('playback_error', ({ message }) => { console.log('Playback_error: ' + message) })
      // Playback status updates
      sdk.addListener('player_state_changed', state => {
				// console.log('state changed: ', state)

				if (state !== null) {
					// console.log('state not null: ', state)
					if (state.context.uri !== null) {
						// console.log('state.context.uri: ', state.context.uri)
						this.$store.dispatch('getCurrentTracks', state.context.uri)
					}
					this.isPlaying = state.paused ? false : true
					this.currentTrack = state.track_window.current_track
					this.$store.dispatch('setCurrentTrack', this.currentTrack)
					this.albumId = state.track_window.current_track.album.uri.split(':').pop()
					this.artistId = state.track_window.current_track.artists[0].uri.split(':').pop()
					this.controlsDisabled = false
					this.scrollToActiveItem()
				}
				this.$store.dispatch('getDevices')
      })
      // Ready
      sdk.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID: ', device_id)
        this.deviceId = device_id
        this.$store.dispatch('setDeviceId', device_id)
        this.$store.dispatch('setActiveDevice', {id: device_id})
      })
      // Not Ready
      sdk.addListener('not_ready', ({ device_id }) => {
				console.log('Not ready with Device ID: ', device_id)
      })
      sdk.connect()

      this.player = sdk
    },
    togglePlayback() {
			this.player.togglePlay().then(() => {
				this.isPlaying = !this.isPlaying
			});
    },
		skipTrack(direction) {
			if (direction) {
				if (direction === 'previous') {
					this.player.previousTrack()
				}
				if (direction === 'next') {
					this.player.nextTrack()
				}
			}    	
    },
    toggleShuffle() {
			this.shuffle = !this.shuffle
			this.$store.dispatch('changeShuffle', this.shuffle)
    },
    toggleLoop() {

			if (this.loop.state === 'off') {
				this.loop.active = true
				this.loop.state = 'context'
			} else if (this.loop.state === 'context') {
				this.loop.state = 'track'
			} else {
				this.loop.active = false
				this.loop.state = 'off'
			}
			this.$store.dispatch('changeLoop', this.loop.state)
    },
    togglePlaylist() {
			this.playlistVisible = !this.playlistVisible
			this.$root.$emit('update:scrollable', !this.playlistVisible)
    },
    closePlaylist() {
			this.playlistVisible = false
    },
    playTrack(index) {
			this.$store.dispatch('playContextTrack', index)
    },
    scrollToActiveItem() {
			let activeElmnt = document.querySelector('div.currentTracklist .active')
			if (activeElmnt) {
				activeElmnt.scrollIntoView()
			}
    },
		transferPlayback(id) {
			this.$store.dispatch('transferPlayback', id).then(() => {
					this.$store.dispatch('getDevices')
				}, error => {
					alert('Error transferring playback to device: ' + error)
				})
    }
	},
	created() {
		this.$store.dispatch('getDevices')
	},
	mounted() {
    window.onSpotifyWebPlaybackSDKReady = () => {}
		this.initiatePlayer()
	}
}
</script>

<style>
.player {
	z-index: 800;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}
.player.mobile {
	display: none;
}
.playerBar {
	z-index: 820;
	height: 80px;
}
.trackInfo {
	width: 500px;
	margin-right: 50px;
}
.trackInfo .placeholder {
	width: 500px;
	height: 80px;
	font-style: italic;
}
.trackInfo .imgPlaceholder {
	width: 80px;
	height: 80px;
	background-color: #111;
}
.currentTracklist {
	z-index: 810;
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	padding-bottom: 80px;
	overflow: scroll;
}
.currentTracklist .closeBtn {
	z-index: 890;
	position: absolute;
	top: 10px;
	right: 20px;
}
</style>