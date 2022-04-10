import { IHeader } from '../../src-electron/preload/header';
import { IApp } from '../../src-electron/preload/app';

declare global {
  interface Window {
    header: IHeader;
    app: IApp;
    downloader: any;
  }
}

export {};
