import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rolldownOptions: {
      input: {
        main: 'index.html',
        blog: 'src/BlogEntry.jsx',
      },
    },
  },
  
  server: {
    port: 5173,
    proxy: {
      '/backend': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/backend/, '/projects/api/v1/v2'),
      },
    },
  },
});