import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 這裡改用 './' (相對路徑)，這樣不管 Repo 叫什麼名字都能通！
  base: './', 
})