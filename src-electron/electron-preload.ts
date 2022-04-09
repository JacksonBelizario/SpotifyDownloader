import { contextBridge } from 'electron';
import header from './preload/header';

contextBridge.exposeInMainWorld('header', header);
