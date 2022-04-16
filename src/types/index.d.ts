import { IHeader } from '../../src-electron/preload/header';
import { IApp } from '../../src-electron/preload/app';
import { IDownloader } from '../../src-electron/preload/downloader';
import { ISettings } from '../../src-electron/preload/settings';

export interface Track {
  id: string;
  name: string;
  artists: string[];
  album_name: string;
  release_date: string;
  cover_url: string;
  URL?: string;
  downloading?: boolean;
  progress?: number;
  filePath?: string;
  failed?: boolean;
}
export interface TrackList {
  items: Track[];
  name: string;
  type?:
    | 'song'
    | 'playlist'
    | 'album'
    | 'artist'
    | 'show'
    | 'episode'
    | 'youtube';
}

export interface Settings {
  outputOnly: boolean;
  concurrentDownloads: number;
}

declare global {
  interface Window {
    header: IHeader;
    app: IApp;
    downloader: IDownloader;
    settings: ISettings;
  }
}

export {};
