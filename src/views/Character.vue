<template>
  {{ $route.params.id }}
</template>
<script lang="ts" setup>
import gql from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, watchEffect, watch } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()

const CHARACTERS_QUERY = gql`
  query getCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        name
      }
      location {
        name
      }
      image
      created
      episode {
        name
        air_date
        episode
      }
    }
  }
`;

const { result, loading, error } = useQuery(CHARACTERS_QUERY, {
  id: route.params.id,
});

watch(result, (value) => {
  console.log(value);
});
</script>
