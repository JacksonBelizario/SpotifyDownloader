import { ipcRenderer } from 'electron';
import { Settings } from '../core/util/settings';

export interface ISettings {
  set(key: string, value: any): void;
  load(): Promise<Settings>;
}

const settings: ISettings = {
  set(key, value) {
    ipcRenderer.invoke('setSetting', key, value);
  },

  async load() {
    return (await ipcRenderer.invoke('getSettings')) as Settings;
  },
};

export default settings;
