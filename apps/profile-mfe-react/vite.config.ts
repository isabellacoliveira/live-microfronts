import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Configuração do Profile MFE com Module Federation.
// Responsabilidade: expor o módulo principal para o host.

export default defineConfig({
  server: {
    port: 5002,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@design-system': fileURLToPath(new URL('../../packages/design-system/src', import.meta.url)),
      '@shared-utils': fileURLToPath(new URL('../../packages/shared-utils/src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    federation({
      name: 'profile_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
});
