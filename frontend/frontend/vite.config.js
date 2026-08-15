import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('fflate')) {
              return 'pdf-generator';
            }
            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
  },
})
