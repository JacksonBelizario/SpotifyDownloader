<template>
  <div class="text-white">
    <q-list dense bordered dark padding>
      <q-item v-for="item in messages" :key="item">
        <q-item-section>
          {{ item }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'LoggerComponent',

  setup() {
    const messages = ref<(string | object)[]>([]);

    onMounted(() => {
      window.app.onLogEvent((message) => {
        messages.value.push(message);
      });
    });

    return {
      messages,
    };
  },
});
</script>
