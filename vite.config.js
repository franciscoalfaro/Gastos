import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Opciones específicas de Rollup...
        manualChunks(id) {
          // Ejemplo de configuración de manualChunks
          if (id.includes('node_modules')) {
            return 'vendor'; // Agrupa todos los módulos de node_modules en un chunk llamado 'vendor'
          }
        },
      },
    },
  },
})
