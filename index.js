import 'dotenv/config';
import Hapi from '@hapi/hapi';
import Hoek from '@hapi/hoek';

import SpotifyWebApi from 'spotify-web-api-node';

let lastDate = null;
let expires = 0;

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.FETCHY_CLIENT_ID,
	clientSecret: process.env.FETCHY_CLIENT_SECRET,
});

const grantCredentials = async () => {
	const now = new Date();
	if (lastDate !== null && Math.floor((now - lastDate)/1000) < expires) {
		console.log(`Credential ainda não expirada ${Math.floor((now - lastDate)/1000)}`);
		return;
	}

	const credentials = await spotifyApi.clientCredentialsGrant();
	lastDate = new Date();
	expires = credentials.body['expires_in'];
	console.log('The access token expires in ' + credentials.body['expires_in']);
	console.log('The access token is ' + credentials.body['access_token']);

	// Save the access token so that it's used in future calls
	spotifyApi.setAccessToken(credentials.body['access_token']);
}

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT || 3001,
		host: 'localhost',
		routes: {
			cors: true,
		}
	});

  await server.register({
    name: 'routeRegister',
    version: '1.0.0',
    register: (server, options) => {
      server.route({
        method: 'GET',
        path: '/artists/{query}',
        handler: async (request, h) => {
        try {
          await grantCredentials();
          const artists = await spotifyApi.searchArtists(`${Hoek.escapeHtml(request.params.query)}`);
          return artists.body.artists.items.map((artist) => ({
            genres: artist.genres,
            followers: artist.followers,
            id: artist.id,
            images: artist.images,
            name: artist.name,
            popularity: artist.popularity,
          }));
        } catch(err) {
          console.log(err);
        }
      }
      })
    
      server.route({
        method: 'GET',
        path: '/toptracks/{query}',
        handler: async (request, h) => {
          try {
            await grantCredentials();
            const topTracks = await spotifyApi.getArtistTopTracks(Hoek.escapeHtml(request.params.query), Hoek.escapeHtml(request.params.country || 'US'));
            const trackFeatures = await spotifyApi.getAudioFeaturesForTracks(topTracks.body.tracks.map((track) => track.id));
            const tracks = topTracks.body.tracks.map((track, key) => {
              return {
                key,
                id: track.id,
                name: track.name,
                duration: track.duration,
                explicit: track.explicit,
                external_ids: track.external_ids,
                popularity: track.popularity,
                artists: track.artists.map((artist) => ({ name: artist.name, id: artist.id })),
                features: trackFeatures.body.audio_features.find((element) => element.id == track.id),
              }
            });
            return tracks;
          } catch (err) {
            console.log(err);
          }
        }
      })
    }
  }, {
    routes: {
      prefix: '/api',
    },
  });

	await server.start();
	console.log('Server running on %s', server.info.uri);
}

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();