import {
  extractTracks,
  //   extractAlbum,
  //   extractArtist,
  //   extractArtistAlbums,
  extractPlaylist,
  //   extractEpisodes,
  //   extractShowEpisodes,
  //   extractSavedShows,
  //   extractSavedAlbums,
  //   extractSavedPlaylists,
  //   extractSavedTracks,
} from '../lib/api.js';

export async function getTrack(url) {
  return (await extractTracks([getID(url)]))[0];
}

export async function getPlaylist(url) {
  return await extractPlaylist(getID(url));
}

const getID = (url) => {
  const splits = url.split('/');
  return splits[splits.length - 1];
};
