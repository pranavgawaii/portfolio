import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    envDir: path.resolve(__dirname, '..'),
    server: {
      port: 3002,
      host: '0.0.0.0',
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },

    publicDir: 'public',
    preview: {
      port: 3002,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          // Firebase isn't chunked here — the frontend never imports lib/firebase.js;
          // it's only reached from the backend (backend/index.js dynamically imports
          // it at runtime for Firestore writes, outside the Vite build entirely).
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react', 'react-snowfall', 'react-github-calendar']
          }
        }
      }
    }
  };
});
