<template>
  <q-page class="row items-center justify-evenly">
    <div class="row no-wrap q-pa-md">
      <div class="column">
        <div class="text-h6 q-mb-md">Settings</div>
        <q-toggle v-model="sample1" label="Sample 1" />
        <q-toggle v-model="sample2" label="Sample 2" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SettingsPage',
  setup() {
    const sample1 = ref(false);
    const sample2 = ref(false);
    return { sample1, sample2 };
  },
});
</script>
