import { contextBridge } from 'electron';
import header from './preload/header';
import app from './preload/app';
import downloader from './preload/downloader';
import settings from './preload/settings';

contextBridge.exposeInMainWorld('header', header);
contextBridge.exposeInMainWorld('app', app);
contextBridge.exposeInMainWorld('downloader', downloader);
contextBridge.exposeInMainWorld('settings', settings);
