<template>
  <q-table
    v-model:selected="track.rawSelected"
    class="sticky-table"
    :rows="track.tracks"
    :columns="columns"
    row-key="name"
    selection="multiple"
    dense
    :rows-per-page-options="[0]"
  >
    <template #header-selection="" />
    <template #body-selection="" />
    <template #body-cell-name="props">
      <q-td :props="props">
        <q-item class="q-px-none">
          <q-item-section v-if="props.row.cover_url" avatar>
            <q-avatar>
              <img :src="props.row.cover_url" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="ellipsis">{{ props.row.name }}</q-item-label>
            <q-item-label
              v-if="props.row.artists.length"
              caption
              lines="1"
              class="ellipsis"
              >{{ props.row.artists.join(', ') }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-td>
    </template>
    <template #body-cell-progress="props">
      <q-td :props="props">
        <q-circular-progress
          v-if="props.row.downloading"
          show-value
          font-size="8px"
          :value="props.value"
          size="35px"
          :thickness="0.15"
          :color="props.value === 100 ? 'primary' : 'orange'"
          track-color="grey-3"
        >
          {{ props.value }}%
        </q-circular-progress>
      </q-td>
    </template>
    <template #header-cell-options="props">
      <q-th :props="props">
        <q-checkbox
          v-if="!track.tracks.find((i) => i.downloading)"
          v-model="props.selected"
        />
      </q-th>
    </template>
    <template #body-cell-options="props">
      <q-td :props="props">
        <template v-if="!props.row.downloading">
          <q-checkbox v-model="props.selected" />
        </template>
        <template v-else-if="props.row.progress === 100">
          <q-btn
            flat
            round
            icon="mdi-file-music-outline"
            @click="showInFolder(props.row.filePath)"
          />
          <q-btn
            flat
            round
            color="accent"
            icon="mdi-play-circle-outline"
            @click="openPath(props.row.filePath)"
          />
        </template>
      </q-td>
    </template>

    <template #no-data="{}">
      <div class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="mdi-lightbulb-on-outline " />
        <span>
          Enter Track, Playlist, Album and Artist Spotify URL to start download
        </span>
      </div>
    </template>
    <template #bottom>
      <q-btn outline label="Cancel" @click="cancel" />
      <q-space />
      <q-btn
        outline
        color="primary"
        label="Download"
        :disabled="track.selected.length === 0"
        @click="download"
      />
    </template>
  </q-table>
</template>

<style lang="scss">
.sticky-table {
  /* height or max-height is important */
  height: calc(100vh - 125px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: var(--q-dark);
  }

  thead tr th {
    position: sticky;
    z-index: 1;
    height: 49px;
  }
  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
  thead tr:first-child th {
    top: 0;
  }
}
</style>

<script>
import { defineComponent } from 'vue';
import { useTrackStore } from '../stores/track';

const columns = [
  {
    name: 'name',
    label: 'File',
    align: 'left',
    field: 'name',
    headerStyle: 'max-width: 380px !important',
    style: 'max-width: 380px !important',
    sortable: true,
  },
  {
    name: 'progress',
    align: 'center',
    label: 'Status',
    field: 'progress',
    headerStyle: 'max-width: 100px !important',
    style: 'max-width: 100px !important',
  },
  {
    name: 'options',
    field: 'options',
    headerStyle: 'max-width: 112px !important',
    style: 'max-width: 112px !important',
  },
];

export default defineComponent({
  name: 'MusicList',

  setup() {
    const track = useTrackStore();

    return {
      columns,
      track,

      cancel() {
        track.removeTracks();
      },

      download() {
        if (process.env.MODE === 'electron') {
          window.downloader.downloadList(
            JSON.parse(JSON.stringify(track.selected))
          );
        }
      },

      showInFolder(filePath) {
        if (process.env.MODE === 'electron') {
          window.downloader.showInFolder(filePath);
        }
      },

      openPath(filePath) {
        if (process.env.MODE === 'electron') {
          window.downloader.openPath(filePath);
        }
      },
    };
  },
});
</script>
