import { defineStore } from 'pinia';
import { Settings } from 'src/types';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    outputOnly: true,
    concurrentDownloads: 10,
  }),
  actions: {
    setSettings(settings: Settings) {
      this.outputOnly = settings.outputOnly;
      this.concurrentDownloads = settings.concurrentDownloads;
    },
  },
});
