import { Settings } from 'app/src-electron/core/util/settings';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    outputOnly: true,
  }),
  actions: {
    setSettings(settings: Settings) {
      this.outputOnly = settings.outputOnly;
    },
  },
});
