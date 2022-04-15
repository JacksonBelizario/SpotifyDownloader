import ElectronStore from 'electron-store';

const storage = new ElectronStore();

export interface Settings {
  outputOnly: boolean;
}

export const set = (key: string, value: any) => {
  storage.set(key, value);
};

export const getSettings = (): Settings => ({
  outputOnly: storage.get('outputOnly') as boolean,
});
