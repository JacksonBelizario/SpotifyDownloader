import { ipcMain, BrowserWindow, dialog } from 'electron';
import { downloadList, queryUrl } from '../core/spotify-dl';

/**
 * @method
 */
export default {
  listen() {
    ipcMain.handle('queryUrl', (_event, url) => queryUrl(url));
    ipcMain.handle('downloadList', async (_event, list) => {
      const { canceled, filePaths } = await dialog.showOpenDialog(
        BrowserWindow.getFocusedWindow(),
        { properties: ['openDirectory'] }
      );
      if (canceled) {
        return;
      }
      const output = filePaths[0];

      BrowserWindow.getFocusedWindow().webContents.send('start-download');

      downloadList(output, list);
    });
  },
};
