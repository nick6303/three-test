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
    component: () => import('@v/Creeper/Light.vue'),
  },
  {
    path: '/head',
    name: 'head',
    component: () => import('@v/Creeper/Head.vue'),
  },
  {
    path: '/walk',
    name: 'walk',
    component: () => import('@v/Creeper/Walk.vue'),
  },
  {
    path: '/point',
    name: 'point',
    component: () => import('@v/Point/Point.vue'),
  },
  {
    path: '/snow',
    name: 'snow',
    component: () => import('@v/Point/Snow.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
