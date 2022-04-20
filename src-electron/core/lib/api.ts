import SpotifyWebApi from 'spotify-web-api-node';
import Config from '../../../node_modules/spotify-dl/config.js';
import Constants from '../../../node_modules/spotify-dl/util/constants.js';
import { Track, TrackList } from '../../../src/types/index.js';
import { chunkArray } from '../util/utils';
import api from '../../api';

const {
  spotifyApi: { clientId, clientSecret },
} = Config;

const {
  AUTH: { REFRESH_ACCESS_TOKEN_SECONDS, TIMEOUT_RETRY },
  MAX_LIMIT_DEFAULT,
  SERVER: { PORT, HOST, CALLBACK_URI },
} = Constants;

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri: `http://${HOST}:${PORT}${CALLBACK_URI}`,
});

let nextTokenRefreshTime;

const verifyCredentials = async () => {
  if (!nextTokenRefreshTime || nextTokenRefreshTime < new Date()) {
    nextTokenRefreshTime = new Date();
    nextTokenRefreshTime.setSeconds(
      nextTokenRefreshTime.getSeconds() + REFRESH_ACCESS_TOKEN_SECONDS
    );
    api.logger('INFO', 'Generating new access token');
    await checkCredentials();
  }
};

const checkCredentials = async () => {
  if (await spotifyApi.getRefreshToken()) {
    await refreshToken();
  } else {
    await requestTokens();
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
      api.logger(
        'ERROR',
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

export async function extractTracks(trackIds: string[]): Promise<Track[]> {
  api.logger('INFO', `TrackIds: ${JSON.stringify(trackIds)}`);
  const extractedTracks = [];
  const chunkedTracks = chunkArray(trackIds, 20);
  for (let x = 0; x < chunkedTracks.length; x++) {
    api.logger(
      'INFO',
      'Extracting track set ' + `${x + 1}/${chunkedTracks.length}`
    );
    const tracks = await callSpotifyApi(
      async () => (await spotifyApi.getTracks(chunkedTracks[x])).body.tracks
    );
    extractedTracks.push(...tracks);
  }
  return extractedTracks.map((track) => parseTrack(track));
}

const parseTrack = (track): Track => {
  return {
    name: track.name,
    artists: track.artists.map((artist) => artist.name),
    album_name: track.album.name,
    release_date: track.album.release_date,
    cover_url: track.album.images.map((image) => image.url)[0],
    id: track.id,
  };
};

export async function extractPlaylist(playlistId): Promise<TrackList> {
  const playlistInfo = await callSpotifyApi(
    async () => (await spotifyApi.getPlaylist(playlistId, { limit: 1 })).body
  );
  const tracks = [];
  let playlistData;
  let offset = 0;
  do {
    playlistData = await callSpotifyApi(
      async () =>
        (
          await spotifyApi.getPlaylistTracks(playlistId, {
            limit: MAX_LIMIT_DEFAULT,
            offset: offset,
          })
        ).body
    );
    if (!offset) {
      api.logger('INFO', `Extracting ${playlistData.total} tracks`);
    }
    tracks.push(...playlistData.items);
    offset += MAX_LIMIT_DEFAULT;
  } while (tracks.length < playlistData.total);

  return {
    name: `${playlistInfo.name} - ${playlistInfo.owner.display_name}`,
    items: tracks
      .filter((item) => item.track)
      .map((item) => parseTrack(item.track)),
  };
}

export async function extractAlbum(albumId): Promise<TrackList> {
  const albumInfo = await callSpotifyApi(
    async () => (await spotifyApi.getAlbum(albumId, { limit: 1 })).body
  );
  const tracks = [];
  let offset = 0;
  let albumTracks;
  do {
    albumTracks = await callSpotifyApi(
      async () =>
        (
          await spotifyApi.getAlbumTracks(albumId, {
            limit: MAX_LIMIT_DEFAULT,
            offset: offset,
          })
        ).body
    );
    if (!offset) {
      api.logger('INFO', `Extracting ${albumTracks.total} tracks`);
    }
    tracks.push(...albumTracks.items);
    offset += MAX_LIMIT_DEFAULT;
  } while (tracks.length < albumTracks.total);

  const trackParsed = (
    await extractTracks(
      tracks.filter((track) => track).map((track) => track.id)
    )
  ).map((track) => {
    track.artists = [albumInfo.artists[0].name, ...track.artists];
    return track;
  });

  return {
    name: `${albumInfo.name} - ${albumInfo.label}`,
    items: trackParsed,
  };
}

export async function extractArtist(artistId) {
  const data = await callSpotifyApi(
    async () => (await spotifyApi.getArtist(artistId)).body
  );
  return {
    id: data.id,
    name: data.name,
    href: data.href,
  };
}

export async function extractArtistAlbums(artistId) {
  const albums = [];
  let offset = 0;
  let artistAlbums;
  do {
    artistAlbums = await callSpotifyApi(
      async () =>
        (
          await spotifyApi.getArtistAlbums(artistId, {
            limit: MAX_LIMIT_DEFAULT,
            offset: offset,
          })
        ).body
    );
    if (!offset) {
      api.logger('INFO', `Extracting ${artistAlbums.total} albums`);
    }
    albums.push(...artistAlbums.items);
    offset += MAX_LIMIT_DEFAULT;
  } while (albums.length < artistAlbums.total);
  // remove albums that are not direct artist albums
  return albums;
}
