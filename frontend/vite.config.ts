import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    envDir: path.resolve(__dirname, '..'),
    server: {
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
      historyApiFallback: true,
      // /api is served locally by `vercel dev --listen 3001` (see root package.json's "dev" script)
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
      port: 3000,
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
        input: {
          main: path.resolve(__dirname, 'index.html'),
          dsa: path.resolve(__dirname, 'dsa.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          resume: path.resolve(__dirname, 'resume.html'),
          blog: path.resolve(__dirname, 'blog.html')
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react', 'react-snowfall', 'react-github-calendar']
          }
        }
      }
    }
  };
});
