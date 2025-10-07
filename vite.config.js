import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Config pour GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/Rewiring-Asia-s-Supply-Chains/', // nom EXACT du repo GitHub
  build: { outDir: 'dist' },
})
