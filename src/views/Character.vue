<template>
  {{ $route.params.id }}
</template>
<script lang="ts" setup>
import gql from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, watchEffect, watch } from "vue";
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
      episode {
        name
        air_date
        episode
      }
      image
      created
    }
  }
`;

const { result, loading, error } = useQuery(CHARACTERS_QUERY, {
  id: 1,
});

watch(result, (value) => {
  console.log(value);
});
</script>
