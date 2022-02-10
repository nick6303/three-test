import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/HelloWorld.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
