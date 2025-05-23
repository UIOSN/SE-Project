import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 自动识别index.js

// 如果不需要CSS可以先注释掉
// import './assets/main.css'

createApp(App)
  .use(router)
  .mount('#app')