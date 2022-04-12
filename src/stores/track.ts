import { defineStore } from 'pinia';
import { Track } from 'src/types';

interface ILoggerState {
  rawTracks: Track[];
}

export const useTrackStore = defineStore({
  id: 'track',
  state: (): ILoggerState => ({
    rawTracks: [],
  }),
  getters: {
    tracks: (state) => state.rawTracks,
  },
  actions: {
    removeTracks() {
      this.rawTracks = [];
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
  },
});
