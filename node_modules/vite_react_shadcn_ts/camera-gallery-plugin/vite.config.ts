import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Required for camera/mic access during local dev (use HTTPS in prod via Vercel)
    https: false,
    host: true,
  },
})
