<template>
  <q-page padding>
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card flat class="my-card" v-if="loading">
        <q-skeleton height="150px" square />
        <q-card-section>
          <q-skeleton type="text" class="text-subtitle1" />
          <q-skeleton type="text" width="50%" class="text-subtitle1" />
          <q-skeleton type="text" class="text-caption" />
        </q-card-section>
      </q-card>
      <q-card class="my-card" flat bordered v-else>
        <q-img :src="character.image" />
        <q-card-section>
          <div class="text-h5 q-mt-sm q-mb-xs">{{ character.name }}</div>
          <q-chip color="primary" text-color="white">
            {{ character.gender }}
          </q-chip>
          <q-chip color="primary" text-color="white">
            {{ character.species }}
          </q-chip>
          <q-chip color="primary" text-color="white">
            {{ character.status }}
          </q-chip>
        </q-card-section>
        <q-card-actions>
          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expanded = !expanded"
            >Episódios</q-btn
          >
        </q-card-actions>
        <q-slide-transition>
          <div v-show="expanded">
            <q-separator />
            <q-card-section class="text-subitle2">
              <q-list dense class="rounded-borders">
                <q-item
                  clickable
                  v-ripple
                  v-for="(eps, key) in character.episode"
                  :key="key"
                >
                  <q-item-section>
                    <q-item-label lines="1">{{
                      `${eps.name} - ${eps.episode}`
                    }}</q-item-label>
                    <q-item-label caption>{{ eps.air_date }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
  </q-page>
</template>
<script lang="ts" setup>
import gql from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, watchEffect, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const expanded = ref<boolean>(false);
const CHARACTERS_QUERY = gql`
  query getCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      episode {
        name
        air_date
        episode
      }
    }
  }
`;

const { result, loading } = useQuery(CHARACTERS_QUERY, {
  id: route.params.id,
});

const character = computed(() => result.value?.character);
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
