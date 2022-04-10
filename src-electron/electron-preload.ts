import { contextBridge } from 'electron';
import header from './preload/header';
import app from './preload/app';
import downloader from './preload/downloader';

contextBridge.exposeInMainWorld('header', header);
contextBridge.exposeInMainWorld('app', app);
contextBridge.exposeInMainWorld('downloader', downloader);
