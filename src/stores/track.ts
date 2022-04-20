import { defineStore } from 'pinia';
import { Track } from 'src/types';

interface ILoggerState {
  url: string | null;
  rawTracks: Track[];
  rawSelected: Track[];
}

export const useTrackStore = defineStore({
  id: 'track',
  state: (): ILoggerState => ({
    url: null,
    rawTracks: [],
    rawSelected: [],
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
  },
});
