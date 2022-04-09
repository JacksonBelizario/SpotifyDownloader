<template>
  <q-layout
    view="lHh lpr lFf"
    container
    style="height: 400px"
    class="shadow-2 rounded-borders"
  >
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <q-icon name="mdi-spotify" />

        <div class="q-electron-drag--exception cursor-pointer non-selectable">
          File
          <q-menu auto-close>
            <q-list dense style="min-width: 100px">
              <q-item clickable>
                <q-item-section>Settings</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <div class="q-electron-drag--exception cursor-pointer non-selectable">
          Help
          <q-menu auto-close>
            <q-list dense style="min-width: 100px">
              <q-item clickable>
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    return {
      version: window.header.version,
      minimize() {
        if (process.env.MODE === 'electron') {
          window.header.minimize();
        }
      },

      closeApp() {
        if (process.env.MODE === 'electron') {
          window.header.close();
        }
      },

      about() {
        if (process.env.MODE === 'electron') {
          window.header.about();
        }
      },
    };
  },
});
</script>
