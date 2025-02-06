import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/event-management/', // Your repository name
  build: {
    outDir: 'dist'
  }
})
 