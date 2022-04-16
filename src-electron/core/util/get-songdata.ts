import { Track, TrackList } from '../../../src/types/index.js';
import {
  extractTracks,
  extractAlbum,
  extractArtist,
  extractArtistAlbums,
  extractPlaylist,
} from '../lib/api.js';

export async function getTrack(url: string): Promise<Track> {
  return (await extractTracks([getID(url)]))[0];
}

export async function getPlaylist(url: string): Promise<TrackList> {
  return await extractPlaylist(getID(url));
}

export async function getAlbum(url: string): Promise<TrackList> {
  return await extractAlbum(getID(url));
}

export async function getArtist(url: string) {
  return await extractArtist(getID(url));
}

export async function getArtistAlbums(url: string) {
  const artistResult = await getArtist(url);
  const albumsResult = await extractArtistAlbums(artistResult.id);
  const albumIds = albumsResult.map((album) => album.id);
  const albumInfos = [];
  for (let x = 0; x < albumIds.length; x++) {
    const albumInfo = await extractAlbum(albumIds[x]);
    // hardcode to artist being requested
    albumInfo.items = albumInfo.items.map((item) => {
      item.artists = [artistResult.name, ...item.artists];
      return item;
    });
    albumInfos.push(albumInfo);
  }
  return albumInfos;
}

const getID = (url: string): string => {
  const splits = url.split('/');
  return splits[splits.length - 1];
};
