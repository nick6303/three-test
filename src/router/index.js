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
  {
    path: '/manandsnow',
    name: 'manandsnow',
    component: () => import('@v/Creeper/WithSnow.vue'),
  },
  {
    path: '/explose',
    name: 'explose',
    component: () => import('@v/Point/Explose.vue'),
  },
  {
    path: '/withexplose',
    name: 'withexplose',
    component: () => import('@v/Creeper/WithExplose.vue'),
  },
  {
    path: '/server',
    name: 'server',
    component: () => import('@v/Server/Server.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
