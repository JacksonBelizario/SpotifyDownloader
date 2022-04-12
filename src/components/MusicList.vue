<template>
  <q-table
    v-model:selected="selected"
    class="sticky-table"
    :rows="track.tracks"
    :columns="columns"
    row-key="name"
    :selected-rows-label="getSelectedString"
    selection="multiple"
    dense
    :rows-per-page-options="[0]"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <q-item class="q-mb-sm">
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
          show-value
          font-size="8px"
          :value="props.value"
          size="35px"
          :thickness="0.15"
          color="orange"
          track-color="grey-3"
        >
          {{ props.value }}%
        </q-circular-progress>
      </q-td>
    </template>
    <template #body-cell-options="props">
      <q-td :props="props">
        <q-btn flat round icon="mdi-file-music-outline" />
        <q-btn flat round color="accent" icon="mdi-play-circle-outline " />
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
        :disabled="selected.length === 0"
        @click="download"
      />
    </template>
  </q-table>
</template>

<style lang="scss">
.sticky-table {
  /* height or max-height is important */
  height: calc(100vh - 141px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: var(--q-dark);
  }

  thead tr th {
    position: sticky;
    z-index: 1;
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
import { defineComponent, ref } from 'vue';
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
    const selected = ref([]);
    const track = useTrackStore();

    return {
      selected,
      columns,
      track,

      getSelectedString() {
        return selected.value.length === 0
          ? ''
          : `${selected.value.length} record${
              selected.value.length > 1 ? 's' : ''
            } selected of ${track.length}`;
      },

      cancel() {
        track.removeTracks();
      },

      download() {
        if (process.env.MODE === 'electron') {
          window.downloader.downloadList(
            JSON.parse(JSON.stringify(selected.value))
          );
        }
      },
    };
  },
});
</script>
