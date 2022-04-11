import { ipcRenderer } from 'electron';

export interface IDownloader {
  queryUrl(url: string): void;
  downloadList(list: object[]): void;
}

const downloader: IDownloader = {
  queryUrl(url) {
    ipcRenderer.invoke('queryUrl', url);
  },
  downloadList(list) {
    ipcRenderer.invoke('downloadList', list);
  },
};

export default downloader;
