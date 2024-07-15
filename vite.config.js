import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  server: {
    proxy: {
      '/media': {
        target: 'https://via.placeholder.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/media/, '')
      },
      '/video': {
        target: 'https://www.w3schools.com/html',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video/, '')
      },
      '/youtube': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/youtube/, '')
      }
    }
  }
});