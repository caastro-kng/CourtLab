import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Supabase's Vercel integration may expose public browser values using
  // NEXT_PUBLIC_* or SUPABASE_* names. CourtLab normalizes only the public
  // URL / anon / publishable key into the VITE_* names consumed by the app.
  // Secret/service-role keys are intentionally never exposed to the client.
  const supabaseUrl =
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.SUPABASE_URL ||
    '';

  const supabasePublicKey =
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    env.SUPABASE_ANON_KEY ||
    env.SUPABASE_PUBLISHABLE_KEY ||
    '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabasePublicKey),
    },
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
  };
});
