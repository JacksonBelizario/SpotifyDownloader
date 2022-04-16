<template>
  <q-layout view="lHh lpr lFf" class="main-window shadow-2">
    <q-header elevated>
      <q-bar class="q-electron-drag text-black">
        <q-icon name="mdi-spotify" />

        <div
          @click="$router.push('/')"
          class="q-electron-drag--exception cursor-pointer"
        >
          Home
        </div>

        <div
          @click="$router.push('/settings')"
          class="q-electron-drag--exception cursor-pointer"
        >
          Settings
        </div>

        <div
          @click="$router.push('/logs')"
          class="q-electron-drag--exception cursor-pointer"
        >
          Logs
        </div>

        <div class="q-electron-drag--exception cursor-pointer non-selectable">
          Help
          <q-menu auto-close>
            <q-list dense style="min-width: 100px">
              <q-item clickable @click="openHomePage">
                <q-item-section>Homepage</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="about">
                <q-item-section>About</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <q-space />

        <div>Spotify Downloader v{{ version }}</div>

        <q-space />

        <q-btn dense flat icon="mdi-minus" @click="minimize" />
        <q-btn dense flat icon="mdi-close" @click="closeApp" />
      </q-bar>
    </q-header>
    <main>
      <q-page-container>
        <router-view />
      </q-page-container>
    </main>
  </q-layout>
</template>

<style scoped lang="scss">
.main-window {
  height: 100vh;
}

main {
  height: calc(100vh - 32px);
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const isElectronMode = process.env.MODE === 'electron';

    return {
      version: isElectronMode ? window.header.version : '',
      minimize() {
        if (isElectronMode) {
          window.header.minimize();
        }
      },

      closeApp() {
        if (isElectronMode) {
          window.header.close();
        }
      },

      about() {
        if (isElectronMode) {
          window.header.about();
        }
      },

      openHomePage() {
        if (isElectronMode) {
          window.header.openHomePage();
        }
      },
    };
  },
});
</script>
