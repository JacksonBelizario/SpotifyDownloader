import { BrowserWindow } from 'electron';

export default function logger(message: string | object) {
  console.log(message);
  const win =
    BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

  win.webContents.send('log-event', message);
}
