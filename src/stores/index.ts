import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

interface Events {
  key: string;
  newValue: any;
}

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  pinia.use(({ store }) => {
    store.$subscribe((mutation) => {
      if (mutation.storeId === 'settings') {
        const events = mutation.events as Events;
        window.settings.set(events.key, events.newValue);
      }
    });
  });

  return pinia;
});
