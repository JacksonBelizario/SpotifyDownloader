import ElectronStore from 'electron-store';
import { Settings } from '../../../src/types';

const storage = new ElectronStore();

export const set = (key: string, value: any) => {
  storage.set(key, value);
};

export const getSettings = (): Settings => ({
  outputOnly: (storage.get('outputOnly') != undefined
    ? storage.get('outputOnly')
    : true) as boolean,
  concurrentDownloads: (storage.get('concurrentDownloads') != undefined
    ? storage.get('concurrentDownloads')
    : 10) as number,
});
