import ffmetadata from 'ffmetadata';
import fs from 'fs';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import Constants from '../../../node_modules/spotify-dl/util/constants.js';
import logger from '../util/logger';
import { Track } from '../../../src/types/index.js';

ffmpeg.setFfmpegPath(ffmpegPath.replace('app.asar', 'app.asar.unpacked'));
ffmetadata.setFfmpegPath(ffmpegPath.replace('app.asar', 'app.asar.unpacked'));

const downloadAndSaveCover = async function (uri: string, filename: string) {
  const writer = fs.createWriteStream(filename);
  const cover = await axios({
    method: 'GET',
    url: uri,
    responseType: 'stream',
  });
  cover.data.pipe(writer);
};

const mergeMetadata = async (output: string, songData: Track) => {
  const coverFileName = output.slice(0, output.length - 3) + 'jpg';
  let coverURL = songData.cover_url;
  if (!coverURL) {
    coverURL = Constants.YOUTUBE_SEARCH.GENERIC_IMAGE;
  }
  await downloadAndSaveCover(coverURL, coverFileName);
  const metadata = {
    artist: songData.artists,
    album: songData.album_name,
    title: songData.name,
    date: songData.release_date,
    attachments: [coverFileName],
  };

  logger({ metadata });

  await new Promise((resolve, reject) => {
    ffmetadata.write(output, metadata, {}, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });

  logger({ output });

  const tempPath = output.slice(0, output.length - 3) + 'temp.mp3';
  logger({ tempPath });
  await new Promise((resolve, reject) => {
    ffmpeg()
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve(true);
      })
      .input(output)
      .addOutputOptions(
        '-i',
        coverFileName,
        '-map',
        '0:0',
        '-map',
        '1:0',
        '-c',
        'copy',
        '-id3v2_version',
        '3'
      )
      .save(tempPath);
  });
  fs.unlinkSync(output);
  fs.renameSync(tempPath, output);
  fs.unlinkSync(coverFileName);
  logger('Metadata Merged!\n');
};

export default mergeMetadata;
