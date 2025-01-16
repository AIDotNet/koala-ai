import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5087',
        changeOrigin: true,
      },
      '/config': {
        target: 'http://localhost:5087',
        changeOrigin: true,
      }
    }
  }
})
