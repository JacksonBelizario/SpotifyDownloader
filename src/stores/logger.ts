import { defineStore } from 'pinia';

interface ILoggerState {
  rawMessages: (string | object)[];
}

export const useLoggerStore = defineStore({
  id: 'logger',
  state: (): ILoggerState => ({
    rawMessages: [],
  }),
  getters: {
    messages: (state) => state.rawMessages,
  },
  actions: {
    addLog(message: string | object) {
      this.rawMessages.push(message);
    },
  },
});
