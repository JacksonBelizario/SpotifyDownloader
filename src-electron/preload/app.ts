import { ipcRenderer } from 'electron';

export interface IApp {
  onLogEvent(callback: (message: string | object) => void): void;
  onMusicList(callback: (list: object[]) => void): void;
}

const app: IApp = {
  onLogEvent: function (callback: (message: string | object) => void): void {
    ipcRenderer.on('log-event', (_event, message) => {
      callback(message);
    });
  },
  onMusicList: function (callback: (list: object[]) => void): void {
    ipcRenderer.on('music-list', (_event, list) => {
      callback(list);
    });
  },
};

export default app;
