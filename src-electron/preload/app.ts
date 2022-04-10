import { ipcRenderer } from 'electron';

export interface IApp {
  onLogEvent(callback: (arg: string | object) => void): void;
}

const app: IApp = {
  onLogEvent: function (callback: (arg: string | object) => void): void {
    ipcRenderer.on('log-event', (_event, arg) => {
      callback(arg);
    });
  },
};

export default app;
