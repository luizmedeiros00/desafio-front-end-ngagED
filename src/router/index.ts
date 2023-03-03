import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue')
const Character = () => import('../views/Character.vue')

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/character/:id',
    name: 'Character',
    component: Character,
  },

]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
