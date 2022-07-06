import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.FETCHY_CLIENT_ID,
	clientSecret: process.env.FETCHY_CLIENT_SECRET,
});

const getArtistAlbums = async (id) => spotifyApi.getArtistAlbums(id);

const init = async () => {
	spotifyApi.setAccessToken('BQDMwqmdh8mORkq8R8DxwJ472Lou5Q4D5z7xKLGHk1SH1Vdz1dIS98lDtIkoW19odyeATNxHnrTPdmjz0XsHoYPuS9yWaDz8cLCCDAaIIqfr3FELl6g');
	// const credentials = await spotifyApi.clientCredentialsGrant();
	// console.log('The access token expires in ' + credentials.body['expires_in']);
	// console.log('The access token is ' + credentials.body['access_token']);

	// Save the access token so that it's used in future calls
	// spotifyApi.setAccessToken(credentials.body['access_token']);

	const albums = await getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');
	console.log(albums);
}

init();