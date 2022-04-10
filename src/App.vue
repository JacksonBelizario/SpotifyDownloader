<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setCssVar } from 'quasar';

setCssVar('primary', '#1ed760');
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar();
    $q.dark.set(true);
  },
});
</script>
