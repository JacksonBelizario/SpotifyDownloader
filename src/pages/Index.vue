<template>
  <q-page>
    <div class="row">
      <div class="col-12">
        <q-card>
          <q-card-section class="q-pb-none">
            <q-form ref="form" @submit="queryUrl">
              <q-input
                outlined
                v-model="track.url"
                label="URL"
                placeholder="https://open.spotify.com/playlist/xyz"
                :rules="[
                  (val) => !val || validURL(val) || 'Please enter a valid URL',
                  (val) =>
                    !val ||
                    validSpotifyURL(val) ||
                    'Please enter a Spotify URL',
                  (val) =>
                    !val ||
                    validSpotifyType(val) ||
                    'Only Track, Playlist, Album and Artist URL are allowed',
                ]"
              >
                <template #append>
                  <q-btn
                    :disable="!track.url"
                    round
                    dense
                    flat
                    icon="mdi-send"
                    @click="queryUrl"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>
        </q-card>
        <q-linear-progress
          v-if="track.loading"
          :value="track.loading"
          dark
          stripe
          color="secondary"
          :style="{ marginTop: '-4px' }"
        />
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
import { QForm } from 'quasar';
import { useTrackStore } from '../stores/track';

export default defineComponent({
  name: 'IndexPage',
  components: { MusicList },
  setup() {
    const track = useTrackStore();

    const form = ref<QForm | null>(null);
    return {
      track,
      form,

      queryUrl: async () => {
        if (!(await (form.value && form.value.validate()))) {
          return;
        }
        track.startLoading();
        if (process.env.MODE === 'electron') {
          window.downloader.queryUrl(track.url || '');
        }
      },
      validURL(str: string) {
        var pattern = new RegExp(
          '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
          'i'
        );
        return !!pattern.test(str);
      },
      validSpotifyURL(str: string) {
        const url = new URL(str);

        return url.host.includes('spotify.com');
      },
      validSpotifyType(str: string) {
        return ['/track/', '/playlist/', '/album/', '/artist/'].some((v) =>
          str.includes(v)
        );
      },
    };
  },
});
</script>
