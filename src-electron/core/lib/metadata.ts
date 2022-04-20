import ffmetadata from 'ffmetadata';
import fs from 'fs';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import Constants from '../../../node_modules/spotify-dl/util/constants.js';
import { Track } from '../../../src/types/index.js';
import api from '../../api';

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

interface Metadata {
  artist: string[];
  album: string;
  title: string;
  date: string;
  attachments: string[];
}

const writeMetadata = async (output: string, metadata: Metadata) => {
  await new Promise((resolve, reject) => {
    ffmetadata.write(output, metadata, {}, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const writeAlbumArt = async (
  output: string,
  coverFileName: string,
  path: string
) => {
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
      .save(path);
  });
};

const mergeMetadata = async (output: string, songData: Track) => {
  try {
    api.logger('INFO', `Starting metadata merge: ${songData.name}`);

    const coverFileName = output.slice(0, output.length - 3) + 'jpg';

    const coverURL =
      songData.cover_url || Constants.YOUTUBE_SEARCH.GENERIC_IMAGE;

    await downloadAndSaveCover(coverURL, coverFileName);

    const metadata: Metadata = {
      artist: songData.artists,
      album: songData.album_name,
      title: songData.name,
      date: songData.release_date,
      attachments: [coverFileName],
    };

    api.logger('LOG', `Metadata: ${JSON.stringify(metadata, null, 2)}`);

    await writeMetadata(output, metadata);

    const tempPath = output.slice(0, output.length - 3) + 'temp.mp3';

    api.logger('LOG', `Adding album art: ${coverFileName}`);

    await writeAlbumArt(output, coverFileName, tempPath);

    fs.unlinkSync(output);
    fs.renameSync(tempPath, output);
    fs.unlinkSync(coverFileName);

    api.logger('SUCCESS', `Metadata Merged: ${songData.name}`);
  } catch (err) {
    api.logger('ERROR', `Metadata Merged failed: ${err}`);
  }
};

export default mergeMetadata;
