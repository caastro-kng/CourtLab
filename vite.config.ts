import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // AI Studio can disable HMR during agent edits through DISABLE_HMR.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching alongside HMR to reduce unnecessary CPU usage.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
