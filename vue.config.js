var path = '/';

if (process.env.NODE_ENV === 'production') {
	path = '/spotifyexplorer/';
}
if (process.env.NODE_ENV === 'test') {
	path = '/spotifyexplorer/dev/';
}

module.exports = {
  publicPath: path
}