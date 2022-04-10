import { BrowserWindow } from 'electron';

export default function logger(message) {
  console.log(message);
  BrowserWindow.getFocusedWindow().webContents.send('log-event', message);
}
