import { ipcRenderer } from 'electron';

export default {
  queryUrl(url) {
    ipcRenderer.invoke('queryUrl', url);
  },
};
