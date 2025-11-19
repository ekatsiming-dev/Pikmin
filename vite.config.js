import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 重要：這裡必須設定為您的 Repository 名稱，前後加上斜線
  // 如果您的 GitHub Repo 叫 yongkang-pikmin，這裡就是 '/yongkang-pikmin/'
  base: '/Pikmin/', 
})
