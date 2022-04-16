import { ipcMain, BrowserWindow, dialog, shell } from 'electron';
import { downloadList, queryUrl } from '../core/spotify-dl';
import * as settings from '../core/util/settings';

/**
 * @method
 */
export default {
  listen() {
    ipcMain.handle('queryUrl', (_event, url: string) => queryUrl(url));
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
    ipcMain.handle('showInFolder', async (_event, filePath: string) => {
      shell.showItemInFolder(filePath);
    });
    ipcMain.handle('openPath', async (_event, filePath: string) => {
      shell.openPath(filePath);
    });

    ipcMain.handle('setSetting', (_event, key: string, value: any) => {
      settings.set(key, value);
    });

    ipcMain.handle('getSettings', () => {
      return settings.getSettings();
    });
  },
};
