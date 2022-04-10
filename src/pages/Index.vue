<template>
  <q-page>
    <div class="row">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <q-input
              outlined
              v-model="url"
              label="URL"
              placeholder="https://open.spotify.com/track/xyz"
            >
              <template #append>
                <q-btn
                  :disable="!url"
                  round
                  dense
                  flat
                  icon="mdi-send"
                  @click="queryUrl"
                />
              </template>
            </q-input>
          </q-card-section>
        </q-card>
        <q-separator />
      </div>
      <div class="col-12">
        <MusicList />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import MusicList from 'components/MusicList.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { MusicList },
  setup() {
    const url = ref<string | null>(null);
    return {
      url,

      queryUrl() {
        if (process.env.MODE === 'electron') {
          window.downloader.queryUrl(url.value || '');
        }
      },
    };
  },
});
</script>
