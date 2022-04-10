<template>
  <q-table
    v-model:selected="selected"
    class="sticky-table"
    :rows="rows"
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
    <template #body-cell-status="props">
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
        <q-btn flat round color="info" icon="mdi-play-circle-outline " />
      </q-td>
    </template>
    <template #bottom>
      <q-btn outline label="Cancel" @click="cancel" />
      <q-space />
      <q-btn outline color="primary" label="Download" />
    </template>
  </q-table>
</template>

<style lang="scss">
.sticky-table {
  /* height or max-height is important */
  height: calc(100vh - 121px);

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
import { defineComponent, onMounted, ref } from 'vue';

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
    name: 'status',
    align: 'center',
    label: 'Status',
    field: 'status',
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
    const rows = ref([]);

    onMounted(() => {
      window.app.onMusicList((musicList) => {
        console.log({ musicList });
        rows.value.push(...musicList);
      });
    });

    return {
      selected,
      columns,
      rows,

      getSelectedString() {
        return selected.value.length === 0
          ? ''
          : `${selected.value.length} record${
              selected.value.length > 1 ? 's' : ''
            } selected of ${rows.value.length}`;
      },

      cancel() {
        rows.value = [];
      },
    };
  },
});
</script>
