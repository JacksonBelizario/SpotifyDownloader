import { defineStore } from 'pinia';
import { Settings } from 'src/types';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    outputOnly: true,
    injectMetadata: true,
    concurrentDownloads: 10,
  }),
  actions: {
    setSettings(settings: Settings) {
      this.outputOnly = settings.outputOnly;
      this.injectMetadata = settings.injectMetadata;
      this.concurrentDownloads = settings.concurrentDownloads;
    },
  },
});
