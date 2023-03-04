import { shallowMount, VueWrapper } from "@vue/test-utils";
import Home from "../src/views/Home.vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { createMockClient } from 'mock-apollo-client';
import {routes} from '../src/router/index'
import mockResolveCharacters from "./__mocks__/MockResolveCharacters";
import { createRouter, createWebHistory } from 'vue-router'

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
      }
    }
  }
`;


describe("Home.vue", async () => {

  type Instance = InstanceType<typeof Home>
  let mountFunction: (options?: object) => VueWrapper<Instance>

  const mockClient = createMockClient();
  mockClient.setRequestHandler(CHARACTERS_QUERY, () =>
    Promise.resolve(mockResolveCharacters)
  );

  const router = createRouter({
    history: createWebHistory(),
    routes: routes,
  })

  router.push('/')
  await router.isReady()

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return shallowMount(Home, {
        global: {
          plugins: [router],
          provide: {
            [DefaultApolloClient]: mockClient
          }
        },
        ...options,
      })
    }
  })

  test("should renders is page content is correct", () => {
    const wrapper = mountFunction()
    expect(wrapper.text()).toMatchSnapshot();
  });

});