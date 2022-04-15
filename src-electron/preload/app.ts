import { ipcRenderer } from 'electron';
import { Track } from 'src/types';

export interface IApp {
  onLogEvent(callback: (message: string | object) => void): void;
  onMusicList(callback: (list: Track[]) => void): void;
  onStartDownload(callback: () => void): void;
  onDownloadProgress(callback: (id: string, progress: number) => void): void;
  onFilePath(callback: (id: string, fielPath: string) => void): void;
}

const app: IApp = {
  onLogEvent: function (callback: (message: string | object) => void): void {
    ipcRenderer.on('log-event', (_event, message) => {
      callback(message);
    });
  },
  onMusicList: function (callback: (list: Track[]) => void): void {
    ipcRenderer.on('music-list', (_event, list) => {
      callback(list);
    });
  },
  onStartDownload: function (callback: () => void): void {
    ipcRenderer.on('start-download', () => {
      callback();
    });
  },
  onDownloadProgress: function (
    callback: (id: string, progress: number) => void
  ): void {
    ipcRenderer.on('download-progress', (_event, id, progress) => {
      callback(id, progress);
    });
  },
  onFilePath: function (
    callback: (id: string, filePath: string) => void
  ): void {
    ipcRenderer.on('file-path', (_event, id, filePath) => {
      callback(id, filePath);
    });
  },
};

export default app;
