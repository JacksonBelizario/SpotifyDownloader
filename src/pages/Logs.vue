<template>
  <q-page>
    <div class="row">
      <div class="col-12 text-white">
        <q-card>
          <q-card-section class="log_viewer">
            <div
              v-for="(log, idx) in logger.messages"
              :key="idx"
              v-html="toHtml(log)"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLoggerStore } from '../stores/logger';
import AnsiUp from 'ansi_up';

const ansiUp = new AnsiUp();
ansiUp.use_classes = true;

export default defineComponent({
  name: 'LogsPage',

  setup() {
    const logger = useLoggerStore();

    const toHtml = (content: string) => {
      return ansiUp
        .ansi_to_html(content.replace(/ /g, '=WHITESPACE='))
        .replace(/=WHITESPACE=/g, '&nbsp;')
        .replace(/\n/g, '<br>');
    };

    return {
      logger,
      toHtml,
    };
  },
});
</script>
