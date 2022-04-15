import { ipcRenderer } from 'electron';
import { Track } from 'src/types';

export interface IDownloader {
  queryUrl(url: string): void;
  downloadList(list: Track[]): void;
  showInFolder(filePath: string): void;
  openPath(filePath: string): void;
}

const downloader: IDownloader = {
  queryUrl(url) {
    ipcRenderer.invoke('queryUrl', url);
  },
  downloadList(list) {
    ipcRenderer.invoke('downloadList', list);
  },
  showInFolder(list) {
    ipcRenderer.invoke('showInFolder', list);
  },
  openPath(list) {
    ipcRenderer.invoke('openPath', list);
  },
};

export default downloader;
