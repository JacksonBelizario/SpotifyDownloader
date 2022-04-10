import { IHeader } from '../../src-electron/preload/header';
import { IApp } from '../../src-electron/preload/app';
import { IDownloader } from '../../src-electron/preload/downloader';

declare global {
  interface Window {
    header: IHeader;
    app: IApp;
    downloader: IDownloader;
  }
}

export {};
