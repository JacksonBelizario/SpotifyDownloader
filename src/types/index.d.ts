import { IHeader } from '../../src-electron/preload/header';
import { IApp } from '../../src-electron/preload/app';
import { IDownloader } from '../../src-electron/preload/downloader';

export interface Track {
  id: string;
  name: string;
  artists: string[];
  album_name: string;
  release_date: string;
  cover_url: string;
  progress?: number;
}

declare global {
  interface Window {
    header: IHeader;
    app: IApp;
    downloader: IDownloader;
  }
}

export {};
