<template>
  <q-page class="row items-center justify-evenly">
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div class="text-h6 q-mb-md">Settings</div>
        <q-toggle v-model="settings.outputOnly" label="Output Only" />
      </div>
    </div>
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
