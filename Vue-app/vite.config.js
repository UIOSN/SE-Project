import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/SE-Project/Vue-app', // 必须与GitHub仓库名完全一致
})