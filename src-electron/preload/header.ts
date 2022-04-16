import { BrowserWindow, dialog, app, shell } from '@electron/remote';

export interface IHeader {
  version: string;
  minimize(): void;
  toggleMaximize(): void;
  close(): void;
  about(): void;
  openHomePage(): void;
}

const header: IHeader = {
  minimize() {
    (BrowserWindow.getFocusedWindow() as Electron.BrowserWindow).minimize();
  },

  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow() as Electron.BrowserWindow;

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },

  close() {
    (BrowserWindow.getFocusedWindow() as Electron.BrowserWindow).close();
  },

  about() {
    dialog.showMessageBox(
      BrowserWindow.getFocusedWindow() as Electron.BrowserWindow,
      {
        type: 'info',
        title: app.getName(),
        message: app.getName(),
        detail: `
          Version: ${app.getVersion()}\n
          Author: Jackson Belizário\n
        `,
      }
    );
  },

  openHomePage() {
    shell.openExternal('https://github.com/JacksonBelizario/SpotifyDownloader');
  },

  version: app.getVersion(),
};

export default header;
