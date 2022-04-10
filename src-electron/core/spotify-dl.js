import path from 'path';
import fs from 'fs';
import { ipcMain } from 'electron';
import Constants from '../../node_modules/spotify-dl/util/constants.js';
import downloader from './lib/downloader.js';
import mergeMetadata from './lib/metadata.js';
import { cleanOutputPath } from '../../node_modules/spotify-dl/util/filters.js';
import getLinks from '../../node_modules/spotify-dl/util/get-link.js';
import logger from './util/logger';

import { getTrack } from './util/get-songdata.js';

const {
  INPUT_TYPES,
  // YOUTUBE_SEARCH: { GENERIC_IMAGE },
} = Constants;

const output = './output';
const outputOnly = true;
const extraSearch = '';

const itemOutputDir = (item) => {
  const outputDir = path.normalize(output);
  return outputOnly
    ? outputDir
    : path.join(
        outputDir,
        cleanOutputPath(item.artists[0]),
        cleanOutputPath(item.album_name)
      );
};

const downloadList = async (list) => {
  list.name = list.name.replace('/', '-');
  const totalItems = list.items.length;
  logger(`Downloading: ${list.name}`);
  logger(`Total Items: ${totalItems}`);
  let currentCount = 0;
  for (const nextItem of list.items) {
    currentCount++;
    const itemDir = itemOutputDir(nextItem);
    // const cached = findId(nextItem.id, itemOutputDir(nextItem));
    const cached = false;
    if (!cached) {
      // const itemId = nextItem.id;
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
            type: list.type,
          });

      const fileNameCleaned = cleanOutputPath(itemName) || '_';

      const outputFilePath = path.resolve(itemDir, `${fileNameCleaned}.mp3`);
      //create the dir if it doesn't exist
      fs.mkdirSync(itemDir, { recursive: true });
      const downloadSuccessful = await downloader(ytLinks, outputFilePath);
      logger({ ytLinks, outputFilePath, downloadSuccessful });
      logger({ Success: downloadSuccessful });
      if (downloadSuccessful) {
        await mergeMetadata(outputFilePath, nextItem);
        // writeId(itemDir, itemId);
      }
      nextItem.failed = !downloadSuccessful;
    }
    nextItem.cached = true;
  }
  logger(`Finished processing ${list.name}!\n`);
  return list;
};

async function queryUrl(url) {
  const type = INPUT_TYPES.SONG.SONG;

  const listResults = [];
  const lists = [];

  const track = await getTrack(url);

  logger(track);

  lists.push({
    items: [track],
    name: `${track.name} ${track.artists[0]}`,
    type: type,
  });

  for (const [x, list] of lists.entries()) {
    logger(`Starting download of list ${x + 1}/${lists.length}`);
    const downloadResult = await downloadList(list);

    listResults.push(downloadResult);

    logger({ list, listResults });
  }
}

/**
 * @method
 */
export default {
  listen() {
    ipcMain.handle('queryUrl', (_event, url) => queryUrl(url));
  },
};
