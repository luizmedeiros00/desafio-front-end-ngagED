<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Characters"
        v-model:pagination="pagination"
        @request="onPaginate"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        row-key="id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="showCharacters(props)"
              icon="visibility"
            ></q-btn>
          </q-td>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Pesquisar nome"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import gql from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";
import type { QTableProps } from "quasar";

const router = useRouter();

const CHARACTERS_QUERY = gql`
  query getCharacters($page: Int!, $filter: String!) {
    characters(page: $page, filter: { name: $filter }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        species
        type
        gender
        __typename
      }
    }
  }
`;
const filter = ref<string>("");
const pagination = ref({
  page: 0,
  rowsPerPage: 0,
  rowsNumber: 0,
});

const columns: QTableProps["columns"] = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    sortable: true,
    field: "id",
  },
  {
    name: "name",
    required: true,
    label: "Nome",
    align: "left",
    sortable: true,
    field: "name",
  },
  {
    name: "species",
    align: "center",
    label: "Espécie",
    field: "species",
    sortable: true,
  },
  { name: "type", label: "Tipo", field: "type", sortable: true },
  { name: "gender", label: "Gênero", field: "gender" },
  {
    name: "actions",
    align: "center",
    label: "Action",
    field: "",
  },
];

const { result, fetchMore, loading } = useQuery(
  CHARACTERS_QUERY,
  () => ({
    page: 1,
    filter: "",
  })
);

const rows = computed(() => result.value?.characters.results ?? []);

watch(result, (value) => {
  pagination.value.page = value.characters.info.next - 1;
  pagination.value.rowsNumber = value.characters.info.count;
  pagination.value.rowsPerPage = 20;
});

const onPaginate: QTableProps["onRequest"] = ({ pagination, filter }) => {
  const { page } = pagination;

  fetchMore({
    variables: {
      page,
      filter: filter,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      // No new feed posts
      if (!fetchMoreResult) return previousResult;
      return {
        characters: {
          ...fetchMoreResult.characters,
        },
      };
    },
  });
};
// function onPaginate(props: QTableProps['onRequest']) {

// }

function showCharacters(props) {
  router.push({
    path: `character/${props.row.id}`,
  });
}
</script>
