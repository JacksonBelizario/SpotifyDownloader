<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar, setCssVar } from 'quasar';

setCssVar('primary', '#1ed760');
setCssVar('accent', '#00c853');

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar();
    $q.dark.set(true);
  },
});
</script>
