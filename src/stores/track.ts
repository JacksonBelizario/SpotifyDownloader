import { defineStore } from 'pinia';
import { Track } from 'src/types';

interface ILoggerState {
  url: string | null;
  rawTracks: Track[];
  rawSelected: Track[];
  loading: number;
}

class FakeProgress {
  interval: NodeJS.Timeout | null;
  current_progress: number;
  step: number;
  loading: number;
  cb!: (progress: number) => void;

  constructor() {
    this.interval = null;
    this.current_progress = 0;
    this.step = 0.3;
    this.loading = 0;
  }

  start(callback: (progress: number) => void) {
    this.cb = callback;
    this.step = 0.3;
    this.interval = setInterval(() => {
      this.current_progress += this.step;
      this.loading =
        Math.round(
          (Math.atan(this.current_progress) / (Math.PI / 2)) * 100_000
        ) / 10_0000;
      if (this.loading >= 1.0) {
        if (this.interval) clearInterval(this.interval);
      } else if (this.loading >= 0.5) {
        this.step = 0.1;
      }
      this.cb(this.loading);
    }, 100);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.loading = 1.0;
    this.cb(this.loading);
    setTimeout(() => {
      this.loading = 0;
      this.cb(this.loading);
    }, 2_200);
  }
}

const fakeProgress = new FakeProgress();

export const useTrackStore = defineStore({
  id: 'track',
  state: (): ILoggerState => ({
    url: null,
    rawTracks: [],
    rawSelected: [],
    loading: 0,
  }),
  getters: {
    tracks: (state) => state.rawTracks,
    selected: (state) => state.rawSelected,
  },
  actions: {
    removeTracks() {
      this.rawTracks = [];
    },
    setDownloading() {
      for (const track of this.rawSelected) {
        const idx = this.rawTracks.findIndex(({ id }) => id === track.id);
        this.rawTracks.splice(idx, 1, {
          ...this.rawTracks[idx],
          downloading: true,
        });
      }
      this.rawSelected = [];
    },
    addTracks(tracks: Track[]) {
      for (const track of tracks) {
        if (!this.rawTracks.some(({ id }) => id === track.id)) {
          this.rawTracks.push(track);
        }
      }
      this.stopLoading();
    },
    changeProgress(itemId: string, progress: number) {
      const idx = this.rawTracks.findIndex(({ id }) => id === itemId);
      if (idx > -1) {
        this.rawTracks.splice(idx, 1, {
          ...this.rawTracks[idx],
          progress,
        });
      }
    },
    setFilePath(itemId: string, filePath: string) {
      const idx = this.rawTracks.findIndex(({ id }) => id === itemId);
      if (idx > -1) {
        this.rawTracks.splice(idx, 1, {
          ...this.rawTracks[idx],
          filePath,
        });
      }
    },
    startLoading() {
      fakeProgress.start((progress) => {
        this.loading = progress;
      });
    },
    stopLoading() {
      fakeProgress.stop();
    },
  },
});
