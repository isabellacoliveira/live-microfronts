import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Configuração do Dashboard MFE com Module Federation.
// Responsabilidade: expor o módulo principal para que o host possa carregá-lo em runtime.

export default defineConfig({
  server: {
    port: 5001,
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
      name: 'dashboard_mfe',
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
