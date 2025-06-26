import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 4173, // or the port you're using
    allowedHosts: ['ems-qxl0.onrender.com'], // ✅ Add your Render domain here
  },
})
