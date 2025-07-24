// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base: '/drag-drop-list/', // set to '/<your-repo-name>/' if deploying to GitHub Pages
  plugins: [react()],
})
