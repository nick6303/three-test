import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import '@css/style.sass'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// 使用繁體中文語言包
import locale from 'element-plus/lib/locale/lang/zh-tw'

import store from './store'

const app = createApp(App)

app.use(router).use(store).use(ElementPlus, { locale }).mount('#app')
