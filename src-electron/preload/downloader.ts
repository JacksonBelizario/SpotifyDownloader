import { ipcRenderer } from 'electron';

export interface IDownloader {
  queryUrl(url: string): void;
}

const downloader: IDownloader = {
  queryUrl(url) {
    ipcRenderer.invoke('queryUrl', url);
  },
};

export default downloader;
