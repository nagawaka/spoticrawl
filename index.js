import 'dotenv/config';
import Hapi from '@hapi/hapi';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.FETCHY_CLIENT_ID,
	clientSecret: process.env.FETCHY_CLIENT_SECRET,
});

const getArtistAlbums = async (id) => spotifyApi.getArtistAlbums(id);

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT || 3001,
		host: 'localhost'
	});

	server.route({
		method: 'GET',
		path: '/albums',
		handler: async (request, h) => {
	// const credentials = await spotifyApi.clientCredentialsGrant();
	// console.log('The access token expires in ' + credentials.body['expires_in']);
	// console.log('The access token is ' + credentials.body['access_token']);

	// Save the access token so that it's used in future calls
	// spotifyApi.setAccessToken(credentials.body['access_token']);

			const albums = await getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');
			console.log(albums);
			return albums;
		}
	})

	await server.start();
	spotifyApi.setAccessToken(process.env.FETCHY_ACCESS_TOKEN);
	console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();