import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';
import { analyzer } from 'vite-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    dts(),
    ...(process.env.ANALYZE === 'true'
      ? [analyzer({ analyzerMode: 'server' })]
      : []),
  ],
  resolve: {
    alias: {
      '@/app': path.resolve(__dirname, './src/app'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/entities': path.resolve(__dirname, './src/entities'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/processes': path.resolve(__dirname, './src/processes'),
    },
  },
  server: {
    allowedHosts: ['polysyllabic-browny-elly.ngrok-free.dev'],
  },
  build: {
    // Telegram Desktop on macOS Ventura can still use Safari 16.1-era WebKit.
    // Keep lazy route chunks within that engine's JavaScript/CSS syntax range.
    target: ['es2020', 'safari15'],
    cssTarget: 'safari15',
  },
});
