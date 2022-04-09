import { IHeader } from '../../src-electron/preload/header';

declare global {
  interface Window {
    header: IHeader;
  }
}

export {};
