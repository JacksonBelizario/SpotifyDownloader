import { ipcMain, BrowserWindow, dialog, shell } from 'electron';
import { Track } from '../../src/types';
import { downloadList, queryUrl } from '../core/spotify-dl';
import * as settings from '../core/util/settings';

type LoggerLevel = 'ERROR' | 'SUCCESS' | 'WARN' | 'INFO' | 'LOG';

const LoggerLevels = {
  ERROR: '[41m[30m ERROR [39m[49m ',
  SUCCESS: '[42m[30m SUCCESS [39m[49m ',
  WARN: '[43m[30m WARNING [39m[49m ',
  INFO: '[44m[30m INFO [39m[49m ',
  LOG: '',
};

const getWindow = (): BrowserWindow =>
  BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

/**
 * @method
 */
export default {
  setFilePath: (id: string, filePath: string) => {
    getWindow().webContents.send('file-path', id, filePath);
  },

  setMusicList: (list: Track[]) => {
    getWindow().webContents.send('music-list', list);
  },

  setDownloadProgress: (id: string, percentual: number) => {
    getWindow().webContents.send('download-progress', id, percentual);
  },

  logger(level: LoggerLevel, message: string) {
    const log = LoggerLevels[level] + message;
    console.log(log);
    getWindow().webContents.send('log-event', log);
  },

  listen() {
    ipcMain.handle('queryUrl', (_event, url: string) => queryUrl(url));
    ipcMain.handle('downloadList', async (_event, list) => {
      const { canceled, filePaths } = await dialog.showOpenDialog(getWindow(), {
        properties: ['openDirectory'],
      });
      if (canceled) {
        return;
      }
      const output = filePaths[0];

      getWindow().webContents.send('start-download');

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
