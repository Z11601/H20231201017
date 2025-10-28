import { createApp } from 'vue'
import { createAppWithReact } from 'veaury'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建 Veaury 混合应用
const app = createAppWithReact({
  rootComponent: App,
  // Vue 全局配置
  vueOptions: {
    plugins: [router, store, ElementPlus]
  },
  // React 全局配置
  reactOptions: {
    // 可以在这里配置 React 的全局设置
  }
})

app.mount('#app')