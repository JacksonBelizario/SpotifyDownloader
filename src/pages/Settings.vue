<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col-12">
        <div class="text-h6">Settings</div>
      </div>
    </div>

    <q-list dense>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>
            Download all songs in the root output dir only
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.outputOnly" val="output-only" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Inject media metadata tags and album art</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.injectMetadata" val="inject-metadata" />
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>
        Concurrent downloads:
        {{ settings.concurrentDownloads }}
      </q-item-label>

      <q-item>
        <q-item-section>
          <q-slider
            v-model="settings.concurrentDownloads"
            :min="1"
            :max="10"
            label
            snap
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSettingsStore } from '../stores/settings';

export default defineComponent({
  name: 'SettingsPage',
  setup() {
    const settings = useSettingsStore();

    return { settings };
  },
});
</script>
