import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientId: 'e171f92e4bda4c47a8db296711413a4d', // Do I need this anymore?
    authorised: false,
    token: null,
    deviceId: null,
    artists: [],
    artist: null,
    albums: null,
    album: null,
    tracks: null,
    playlist: null,
    user: null,
    userPlaylists: null,
    userAlbums: null,
    userArtists: null,
    recentlyPlayed: null,
    searchTerm: null,
    currentTrack: null,
    currentTracks: null,
    playerContext: null,
    devices: null,
    activeDevice: null
  },
  getters: {
    ACCESS_TOKEN: state => state.token,
    ARTISTS: state => state.artists,
    ARTIST_DETAILS: state => state.artist,
    ALBUMS: state => state.albums,
    ALBUM: state => state.album,
    TRACKS: state => state.tracks,
    PLAYLIST: state => state.playlist,
    USER: state => state.user,
    USER_PLAYLISTS: state => state.userPlaylists,
    USER_ALBUMS: state => state.userAlbums,
    USER_ARTISTS: state => state.userArtists,
    RECENTLY_PLAYED: state => state.recentlyPlayed,
    SEARCH_TERM: state => state.searchTerm,
    DEVICE_ID: state => state.deviceId,
    CURRENT_TRACK: state => state.currentTrack,
    CURRENT_TRACKS: state => state.currentTracks,
    DEVICES: state => state.devices,
    ACTIVE_DEVICE: state => state.devices
  },
  mutations: {
    SET_ACCESS_TOKEN(state, token) {
      state.token = token;
      state.authorised = true;
    },
    REMOVE_ACCESS_TOKEN(state) {
      state.token = null;
      state.authorised = false;
    },
    SET_DEVICE_ID(state, id) {
      state.deviceId = id
    },
    SET_ARTISTS(state, payload) {
      state.artists = payload
    },
    SET_ARTIST(state, payload) {
      state.artist = payload
    },
    SET_ALBUMS(state, payload) {
      state.albums = payload
    },
    SET_ALBUM(state, payload) {
      state.album = payload
    },
    SET_TRACKS(state, payload) {
      state.tracks = payload
    },
    SET_PLAYLIST(state, payload) {
      state.playlist = payload
    },
    SET_USER(state, payload) {
      state.user = payload
    },
    SET_USER_PLAYLISTS(state, payload) {
      state.userPlaylists = payload
    },
    SET_USER_ALBUMS(state, payload) {
      state.userAlbums = payload
    },
    SET_USER_ARTISTS(state, payload) {
      state.userArtists = payload
    },
    SET_RECENTLY_PLAYED(state, payload) {
      state.recentlyPlayed = payload
    },
    SET_SEARCH_TERM(state, payload) {
      state.recentlyPlayed = payload
    },
    SET_CURRENT_TRACK(state, payload) {
      state.currentTrack = payload
    },
    SET_CURRENT_TRACKS(state, payload) {
      state.currentTracks = payload
    },
    SET_PLAYER_CONTEXT(state, payload) {
      state.playerContext = payload
    },
    SET_DEVICES(state, payload) {
      state.devices = payload
    },
    SET_ACTIVE_DEVICE(state, payload) {
      state.activeDevice = payload
    }
  },
  actions: {
    setToken(context, token) {
      if (token !== undefined) {
        context.commit('SET_ACCESS_TOKEN', token)
      }
    },
    removeToken(context) {
      context.commit('REMOVE_ACCESS_TOKEN')
    },
    setDeviceId(context, id) {
      context.commit('SET_DEVICE_ID', id)
    },
    getTopArtists(context, offset) {

      var offsetAmt = offset === undefined ? 0 : offset;

      axios.get('https://api.spotify.com/v1/me/top/artists?limit=20&offset=' + offsetAmt, {
        headers: {
          Authorization: 'Bearer ' + this.state.token
        }
      })
      .then((res) => {        
        var artists = res.data;
        context.commit('SET_ARTISTS', artists)
      })
      .catch(err => {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    searchArtists(context, [value, offset]) {

      var offsetAmt = offset === undefined ? 0 : offset;
      context.commit('SET_SEARCH_TERM', value)

      axios.get('https://api.spotify.com/v1/search?q=' + value + '&type=artist&offset=' + offsetAmt, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var artists = res.data.artists;
        context.commit('SET_ARTISTS', artists)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getArtist(context, id) {

      axios.get('https://api.spotify.com/v1/artists/' + id, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var artist = res.data;
        context.commit('SET_ARTIST', artist)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getAlbums(context, [id, groups]) {

      axios.get('https://api.spotify.com/v1/artists/' + id + '/albums?q=&include_groups=' + groups + '&country=' + this.state.user.country, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var albums = res.data;
        context.commit('SET_ALBUMS', albums)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getAlbum(context, id) {

      axios.get('https://api.spotify.com/v1/albums/' + id + '?market=' + this.state.user.country, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var album = res.data;
        context.commit('SET_ALBUM', album)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getTracks(context, id) {

      axios.get('https://api.spotify.com/v1/albums/' + id + '/tracks', {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var tracks = res.data;
        context.commit('SET_TRACKS', tracks)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getPlaylist(context, id) {

      axios.get('https://api.spotify.com/v1/playlists/' + id + '?market=' + this.state.user.country, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var playlist = res.data;
        context.commit('SET_PLAYLIST', playlist)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getPlaylistTracks(context, id) {

      axios.get('https://api.spotify.com/v1/playlists/' + id + '/tracks', {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var tracks = res.data;
        context.commit('SET_TRACKS', tracks)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getUser(context) {

      axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var user = res.data;
        context.commit('SET_USER', user)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getUserPlaylists(context, offset) {

      var offsetAmt = offset === undefined ? 0 : offset;

      axios.get('https://api.spotify.com/v1/me/playlists?limit=20&offset=' + offsetAmt, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var playlists = res.data.items;
        context.commit('SET_USER_PLAYLISTS', playlists)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getUserAlbums(context, offset) {

      var offsetAmt = offset === undefined ? 0 : offset;

      axios.get('https://api.spotify.com/v1/me/albums?limit=20&offset=' + offsetAmt, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {        
        var albums = res.data.items;
        context.commit('SET_USER_ALBUMS', albums)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getUserArtists(context) {

      axios.get('  https://api.spotify.com/v1/me/following?q=&type=artist&limit=50', {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var artists = res.data.artists.items;
        context.commit('SET_USER_ARTISTS', artists)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getRecentlyPlayed(context) {

      axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        var recent = res.data.items;
        context.commit('SET_RECENTLY_PLAYED', recent)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    playTrack(context, [contextUri, trackUris, offset]) {

      let uri = {};

      if (contextUri !== null) {
        uri.context_uri = contextUri;
      }
      if (trackUris !== null) {
        uri.uris = trackUris;
      }
      if (contextUri !== null || trackUris !== null) {
        if (offset !== null) {
          uri.offset = {'position': offset};
        }
      }

      axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + this.state.activeDevice.id, uri,
      {
        headers: { 'Authorization': 'Bearer ' + this.state.token }
      })
      .then((res) => {
        if (res.status === 204) {
          context.commit('SET_PLAYER_CONTEXT', uri)
        }
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    playContextTrack(context, offset) {

      let uri = this.state.playerContext;

      if (offset !== null) {
        uri.offset = {'position': offset};
      }

      axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + this.state.activeDevice.id, uri,
      {
        headers: { 'Authorization': 'Bearer ' + this.state.token }
      })
      .then((res) => {
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    setCurrentTrack(context, track) {
      context.commit('SET_CURRENT_TRACK', track)
    },
    setCurrentTracks(context, tracks) {
      context.commit('SET_CURRENT_TRACKS', tracks)
    },
    getCurrentTracks(context, contextUri) {

      let type = contextUri.split(':')[1],
          id = contextUri.split(':').pop(),
          url ='https://api.spotify.com/v1/' + type + 's/' + id + '/tracks?market=' + this.state.user.country;

      axios.get(url, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        let tracks = [],
            uri = {'context_uri': contextUri};

        if (type == 'playlist') {
          for (var i = 0; i < res.data.items.length; i++) {
            tracks.push(res.data.items[i].track);
          }
        } else {
          tracks = res.data.items;
        }
        context.commit('SET_CURRENT_TRACKS', tracks)
        context.commit('SET_PLAYER_CONTEXT', uri)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    changeShuffle(context, state) {
      let url = 'https://api.spotify.com/v1/me/player/shuffle?state=' + state
      axios.put(url, null, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    changeLoop(context, state) {
      let url = 'https://api.spotify.com/v1/me/player/repeat?state=' + state
      axios.put(url, null, {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    getDevices(context) {
      axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: {
          'Authorization': 'Bearer ' + this.state.token
        }
      })
      .then((res) => {
        context.commit('SET_DEVICES', res.data.devices)

        let activeDevice = {};
        for (var i = 0; i < res.data.devices.length; i++) {
          if (res.data.devices[i].is_active) {
            activeDevice = res.data.devices[i]
          }
        }
        context.commit('SET_ACTIVE_DEVICE', activeDevice)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ' + err)
      });
    },
    setActiveDevice(context, device) {
      context.commit('SET_ACTIVE_DEVICE', device)
    },
    transferPlayback(context, id) {
      let deviceId = {"device_ids": [id]}

      return new Promise((resolve, reject) => {
        axios.put('https://api.spotify.com/v1/me/player', deviceId,
        {
          headers: { 'Authorization': 'Bearer ' + this.state.token }
        })
        .then((res) => {
          resolve(res); 
        })
        .catch(function(err) {
          // TODO: Error handling
          reject(err);
          alert('STORE ERROR: ' + err)
        });
      });
    }
  }
})
