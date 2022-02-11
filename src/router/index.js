import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@v/Index.vue'),
  },
  {
    path: '/hello',
    name: 'hello',
    component: () => import('@v/HelloWorld.vue'),
  },
  {
    path: '/light',
    name: 'light',
    component: () => import('@v/Light.vue'),
  },
  {
    path: '/head',
    name: 'head',
    component: () => import('@v/Head.vue'),
  },
  {
    path: '/walk',
    name: 'walk',
    component: () => import('@v/Walk.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
