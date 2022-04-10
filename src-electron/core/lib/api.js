import SpotifyWebApi from 'spotify-web-api-node';
import Config from '../../../node_modules/spotify-dl/config.js';
import Constants from '../../../node_modules/spotify-dl/util/constants.js';
import logger from '../util/logger';

const {
  spotifyApi: { clientId, clientSecret },
} = Config;

const {
  AUTH: {
    // SCOPES: {
    //   USERS_SAVED_PLAYLISTS,
    //   USERS_SAVED_TRACKS_ALBUMS,
    //   USERS_TOP_TRACKS,
    // },
    // STATE,
    REFRESH_ACCESS_TOKEN_SECONDS,
    TIMEOUT_RETRY,
  },
  //   INPUT_TYPES,
  //   MAX_LIMIT_DEFAULT,
  SERVER: { PORT, HOST, CALLBACK_URI },
} = Constants;

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri: `http://${HOST}:${PORT}${CALLBACK_URI}`,
});

// const scopes = [
//   USERS_SAVED_PLAYLISTS,
//   USERS_SAVED_TRACKS_ALBUMS,
//   USERS_TOP_TRACKS,
// ];

let nextTokenRefreshTime;

const verifyCredentials = async () => {
  if (!nextTokenRefreshTime || nextTokenRefreshTime < new Date()) {
    nextTokenRefreshTime = new Date();
    nextTokenRefreshTime.setSeconds(
      nextTokenRefreshTime.getSeconds() + REFRESH_ACCESS_TOKEN_SECONDS
    );
    logger('Generating new access token');
    await checkCredentials();
  }
};

const checkCredentials = async () => {
  if (await spotifyApi.getRefreshToken()) {
    await refreshToken();
  } else {
    // const {
    //   inputs,
    //   username,
    //   password,
    //   login,
    // } = cliInputs();

    // const requiresLogin = inputs.find(input =>
    //   input.type == INPUT_TYPES.SONG.SAVED_ALBUMS ||
    //   input.type == INPUT_TYPES.SONG.SAVED_PLAYLISTS ||
    //   input.type == INPUT_TYPES.SONG.SAVED_TRACKS ||
    //   input.type == INPUT_TYPES.EPISODE.SAVED_SHOWS,
    // );

    // const requestingLogin = (username && password) || login;

    // if (requiresLogin || requestingLogin) {
    //   await requestAuthorizedTokens();
    // } else
    {
      await requestTokens();
    }
  }
};

const requestTokens = async () => {
  setTokens((await spotifyApi.clientCredentialsGrant()).body);
};

const refreshToken = async () => {
  setTokens((await spotifyApi.refreshAccessToken()).body);
};

const setTokens = (tokens) => {
  spotifyApi.setAccessToken(tokens['access_token']);
  spotifyApi.setRefreshToken(tokens['refresh_token']);
};

// common wrapper for api calls
// to have token verification and api throttling mitigation
const callSpotifyApi = async function (apiCall) {
  const maxRetries = 5;
  let tries = 1;
  let error;

  while (tries <= maxRetries) {
    await verifyCredentials();

    try {
      return await apiCall();
    } catch (e) {
      error = e;
      logger(
        `Got a spotify api error (${e})\n` +
          `Timing out for 5 minutes x ${tries}`
      );
      await new Promise((resolve) => setTimeout(resolve, TIMEOUT_RETRY * 1000));
      tries++;
    }
  }
  // if it still fails after all the timeouts and retries throw again
  throw new Error(error);
};

export async function extractTracks(trackIds) {
  logger({ trackIds });
  const extractedTracks = [];
  const chunkedTracks = chunkArray(trackIds, 20);
  for (let x = 0; x < chunkedTracks.length; x++) {
    logger('extracting track set ' + `${x + 1}/${chunkedTracks.length}`);
    const tracks = await callSpotifyApi(
      async () => (await spotifyApi.getTracks(chunkedTracks[x])).body.tracks
    );
    extractedTracks.push(...tracks);
  }
  return extractedTracks.map((track) => parseTrack(track));
}

const parseTrack = (track) => {
  return {
    name: track.name,
    artists: track.artists.map((artist) => artist.name),
    album_name: track.album.name,
    release_date: track.album.release_date,
    cover_url: track.album.images.map((image) => image.url)[0],
    id: track.id,
  };
};

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
