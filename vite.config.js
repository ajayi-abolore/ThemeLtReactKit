
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import lifetechReact from '@lifetechocms/react/vite';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === 'build'
      ? [
          lifetechReact({
            themeName: 'ThemeLtReactTest',
            layoutsDirectory: 'src/Layouts',
            viewsDirectory: 'src/Views'
          })
        ]
      : [])
  ],

  base: './',

  server: {
    port: 5173,
    proxy: {
      '/backend': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path =>
          path.replace(/^\/backend/, '/projects/api/v1/v2')
      }
    }
  }
}));
