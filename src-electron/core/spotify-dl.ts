import path from 'path';
import fs from 'fs';
import Constants from '../../node_modules/spotify-dl/util/constants.js';
import downloader from './lib/downloader.js';
import mergeMetadata from './lib/metadata.js';
import { cleanOutputPath } from '../../node_modules/spotify-dl/util/filters.js';
import getLinks from '../../node_modules/spotify-dl/util/get-link.js';
import urlParser from '../../node_modules/spotify-dl/util/url-parser.js';
import { getSettings } from './util/settings';
import { chunkArray } from './util/utils';
import api from '../api';

import {
  getTrack,
  getPlaylist,
  getAlbum,
  getArtistAlbums,
} from './util/get-songdata.js';
import { Track, TrackList } from '../../src/types/index.js';

const { INPUT_TYPES } = Constants;

const itemOutputDir = (output: string, item: Track) => {
  const outputOnly = getSettings().outputOnly;
  const outputDir = path.normalize(output);
  return outputOnly
    ? outputDir
    : path.join(
        outputDir,
        cleanOutputPath(item.artists[0]),
        cleanOutputPath(item.album_name)
      );
};

const download = async (output: string, nextItem: Track) => {
  const itemDir = itemOutputDir(output, nextItem);
  const itemId = nextItem.id;
  const itemName = nextItem.name;
  const albumName = nextItem.album_name;
  const artistName = nextItem.artists[0];

  api.logger(`
    Artist: ${artistName}\n
    Album: ${albumName}\n
    Item: ${itemName}
  `);

  const ytLinks = nextItem.URL
    ? [nextItem.URL]
    : await getLinks({ itemName, albumName, artistName });

  const fileNameCleaned = cleanOutputPath(itemName) || '_';

  const outputFilePath = path.resolve(itemDir, `${fileNameCleaned}.mp3`);

  api.setFilePath(itemId, outputFilePath);

  //create the dir if it doesn't exist
  fs.mkdirSync(itemDir, { recursive: true });

  const downloadSuccessful = await downloader(itemId, ytLinks, outputFilePath);

  const injectMetadata = getSettings().injectMetadata;

  if (downloadSuccessful && injectMetadata) {
    await mergeMetadata(outputFilePath, nextItem);
  }

  nextItem.failed = !downloadSuccessful;

  return nextItem;
};

export const downloadList = async (output: string, items: Track[]) => {
  api.logger(`Total Items: ${items.length}`);

  const concurrentDownloads = getSettings().concurrentDownloads;
  const chunkedItems = chunkArray(items, concurrentDownloads);

  for (const items of chunkedItems) {
    await Promise.all(items.map((item) => download(output, item)));
  }

  api.logger(`Finished processing ${items.length}!`);
};

export async function queryUrl(URL: string) {
  if (!URL) {
    return;
  }
  const type = urlParser(URL);

  const lists: TrackList[] = [];

  switch (type) {
    case INPUT_TYPES.SONG.SONG: {
      const track = await getTrack(URL);

      lists.push({
        items: [track],
        name: `${track.name} ${track.artists[0]}`,
        type,
      });
      break;
    }
    case INPUT_TYPES.SONG.PLAYLIST: {
      const list = (await getPlaylist(URL)) as TrackList;
      list.type = type;
      lists.push(list);
      break;
    }
    case INPUT_TYPES.SONG.ALBUM: {
      const list = (await getAlbum(URL)) as TrackList;
      list.type = type;
      lists.push(list);
      break;
    }
    case INPUT_TYPES.SONG.ARTIST: {
      const artistAlbumInfos = await getArtistAlbums(URL);
      lists.push(
        ...artistAlbumInfos.map((list: TrackList) => {
          list.type = type;
          return list;
        })
      );
      break;
    }
  }

  api.setMusicList(lists.flatMap((x) => x.items));
}
