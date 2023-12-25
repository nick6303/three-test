import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Present',
    component: () => import('@v/Present/Present.vue'),
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import('@v/Edit/Edit.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@v/Login/Login.vue'),
  },
  {
    path: '/menu',
    name: 'menu',
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
    path: '/shoes',
    name: 'shoes',
    component: () => import('@v/Shoes/Shoes.vue'),
  },
  {
    path: '/test1',
    name: 'test1',
    component: () => import('@v/test1/Test.vue'),
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('@v/test2/Test2.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export default router
