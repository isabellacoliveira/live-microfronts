import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Configuração do host para consumo de remotes.
// Responsabilidade: carregar os MFEs em runtime e compartilhar dependências com o design system.

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        dashboard_mfe: 'dashboard_mfe@http://localhost:5001/assets/remoteEntry.js',
        profile_mfe: 'profile_mfe@http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', '@design-system'],
    }),
  ],
  resolve: {
    alias: {
      '@design-system': fileURLToPath(new URL('../../packages/design-system/src/index.ts', import.meta.url)),
    },
  },
});
