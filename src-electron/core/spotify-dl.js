import path from 'path';
import fs from 'fs';
import { BrowserWindow } from 'electron';
import Constants from '../../node_modules/spotify-dl/util/constants.js';
import downloader from './lib/downloader.js';
import mergeMetadata from './lib/metadata.js';
import { cleanOutputPath } from '../../node_modules/spotify-dl/util/filters.js';
import getLinks from '../../node_modules/spotify-dl/util/get-link.js';
import urlParser from '../../node_modules/spotify-dl/util/url-parser.js';
import logger from './util/logger';
import { getSettings } from './util/settings';

import {
  getTrack,
  getPlaylist,
  getAlbum,
  getArtistAlbums,
} from './util/get-songdata.js';

const {
  INPUT_TYPES,
  // YOUTUBE_SEARCH: { GENERIC_IMAGE },
} = Constants;

const extraSearch = '';

const itemOutputDir = (output, item) => {
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

const setFilePath = (id, filePath) => {
  const win =
    BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

  win.webContents.send('file-path', id, filePath);
};

export const downloadList = async (output, items) => {
  const totalItems = items.length;
  logger(`Total Items: ${totalItems}`);
  let currentCount = 0;
  for (const nextItem of items) {
    currentCount++;
    const itemDir = itemOutputDir(output, nextItem);
    // const cached = findId(nextItem.id, itemOutputDir(nextItem));
    const cached = false;
    if (!cached) {
      const itemId = nextItem.id;
      const itemName = nextItem.name;
      const albumName = nextItem.album_name;
      const artistName = nextItem.artists[0];
      logger(
        [
          `${currentCount}/${totalItems}`,
          `Artist: ${artistName}`,
          `Album: ${albumName}`,
          `Item: ${itemName}`,
        ].join('\n')
      );

      const ytLinks = nextItem.URL
        ? [nextItem.URL]
        : await getLinks({
            itemName,
            albumName,
            artistName,
            extraSearch,
            // type: list.type,
          });

      const fileNameCleaned = cleanOutputPath(itemName) || '_';

      const outputFilePath = path.resolve(itemDir, `${fileNameCleaned}.mp3`);

      setFilePath(itemId, outputFilePath);

      //create the dir if it doesn't exist
      fs.mkdirSync(itemDir, { recursive: true });
      const downloadSuccessful = await downloader(
        itemId,
        ytLinks,
        outputFilePath
      );
      logger({ ytLinks, outputFilePath, downloadSuccessful });
      if (downloadSuccessful) {
        await mergeMetadata(outputFilePath, nextItem);
        // writeId(itemDir, itemId);
      }
      nextItem.failed = !downloadSuccessful;
    }
    nextItem.cached = true;
  }
  logger(`Finished processing ${totalItems}!\n`);
  return items;
};

export async function queryUrl(URL) {
  if (!URL) {
    return;
  }
  const type = urlParser(URL);

  // const listResults = [];
  const lists = [];

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
      const list = await getPlaylist(URL);
      list.type = type;
      lists.push(list);
      break;
    }
    case INPUT_TYPES.SONG.ALBUM: {
      const list = await getAlbum(URL);
      list.type = type;
      lists.push(list);
      break;
    }
    case INPUT_TYPES.SONG.ARTIST: {
      const artistAlbumInfos = await getArtistAlbums(URL);
      lists.push(
        ...artistAlbumInfos.map((list) => {
          list.type = type;
          return list;
        })
      );
      break;
    }
    // case INPUT_TYPES.EPISODE.EPISODE: {
    //   const episode = await getEpisode(URL);
    //   if (episode) {
    //     lists.push({
    //       items: [episode],
    //       name: `${episode.name} ${episode.album_name}`,
    //       type: type,
    //     });
    //   } else {
    //     logFailure('Failed to find episode, you may need to use auth');
    //   }

    //   break;
    // }
    // case INPUT_TYPES.EPISODE.SHOW: {
    //   const list = await getShowEpisodes(URL);
    //   list.type = type;
    //   lists.push(list);
    //   break;
    // }

    // case INPUT_TYPES.EPISODE.SAVED_SHOWS: {
    //   const savedShowsInfo = await getSavedShows();
    //   lists.push(
    //     ...savedShowsInfo.map((list) => {
    //       list.type = type;
    //       return list;
    //     })
    //   );
    //   break;
    // }
    // case INPUT_TYPES.SONG.SAVED_ALBUMS: {
    //   const savedAlbumsInfo = await getSavedAlbums();
    //   lists.push(
    //     ...savedAlbumsInfo.map((list) => {
    //       list.type = type;
    //       return list;
    //     })
    //   );
    //   break;
    // }
    // case INPUT_TYPES.SONG.SAVED_PLAYLISTS: {
    //   const savedPlaylistsInfo = await getSavedPlaylists();
    //   lists.push(
    //     ...savedPlaylistsInfo.map((list) => {
    //       list.type = type;
    //       return list;
    //     })
    //   );
    //   break;
    // }
    // case INPUT_TYPES.SONG.SAVED_TRACKS: {
    //   const list = await getSavedTracks();
    //   list.type = type;
    //   lists.push(list);
    //   break;
    // }

    // case INPUT_TYPES.YOUTUBE: {
    //   lists.push({
    //     items: [
    //       {
    //         name: URL,
    //         artists: [''],
    //         album_name: URL,
    //         release_date: null,
    //         //todo can we get the youtube image?
    //         cover_url: GENERIC_IMAGE,
    //         id: URL,
    //         URL: URL,
    //       },
    //     ],
    //     name: URL,
    //     type: type,
    //   });
    //   break;
    // }
    // default: {
    //   throw new Error(
    //     `Invalid URL type (${type}), ` +
    //       'Please visit github and make a request to support this type'
    //   );
    // }
  }

  BrowserWindow.getFocusedWindow().webContents.send(
    'music-list',
    lists.flatMap((x) => x.items)
  );
}
