import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientId: 'e171f92e4bda4c47a8db296711413a4d',
    authorised: false,
    token: null,
    artists: [],
    artist: null,
    albums: [],
    album: null,
    tracks: null
  },
  getters: {
    ARTISTS: state => state.artists,
    ARTIST_DETAILS: state => state.artist,
    ALBUMS: state => state.albums,
    ALBUM: state => state.album,
    TRACKS: state => state.tracks
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
    }
  },
  actions: {
    setToken(context, token) {
      if(token !== undefined) {
        context.commit('SET_ACCESS_TOKEN', token)
      }
    },
    removeToken(context) {
      context.commit('REMOVE_ACCESS_TOKEN')
    },
    getTopArtists(context) {

      var request = new Request('https://api.spotify.com/v1/me/top/artists', {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.state.token
        })
      });

      fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        var artists = myJson.items.map(function(item) {
          return item;
        });
        context.commit('SET_ARTISTS', artists)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ', err)
      });
    },
    searchArtists(context, value) {

      var request = new Request('https://api.spotify.com/v1/search?q=' + value + '&type=artist', {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.state.token
        })
      });

      fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        var artists = myJson.artists.items.map(function(item) {
          return item;
        });
        context.commit('SET_ARTISTS', artists)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ', err)
      });
    },
    getArtist(context, id) {

      var request = new Request('https://api.spotify.com/v1/artists/' + id, {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.state.token
        })
      });

      fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        var artist = myJson;
        context.commit('SET_ARTIST', artist)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ', err)
      });
    },
    getAlbums(context, id) {

      var request = new Request('https://api.spotify.com/v1/artists/' + id + '/albums', {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.state.token
        })
      });

      fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        var albums = myJson;
        context.commit('SET_ALBUMS', albums)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ', err)
      });
    },
    getAlbum(context, id) {

      var request = new Request('https://api.spotify.com/v1/albums/' + id, {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.state.token
        })
      });

      fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        var album = myJson;
        context.commit('SET_ALBUM', album)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ', err)
      });
    },
    getTracks(context, id) {

      var request = new Request('https://api.spotify.com/v1/albums/' + id + '/tracks', {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + this.state.token
        })
      });

      fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        var tracks = myJson;
        context.commit('SET_TRACKS', tracks)
      })
      .catch(function(err) {
        // TODO: Error handling
        alert('STORE ERROR: ', err)
      });
    }
  }
})
