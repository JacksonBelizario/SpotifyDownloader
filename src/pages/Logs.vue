<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-white">
        <q-card>
          <q-card-section>
            <q-list dense bordered dark padding>
              <q-item v-for="item in messages" :key="item">
                <q-item-section>
                  {{ item }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'LogsPage',

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
