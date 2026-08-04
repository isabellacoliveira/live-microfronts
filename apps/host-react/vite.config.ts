import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Configuração do host para consumo de remotes.
// Responsabilidade: carregar os MFEs em runtime e compartilhar dependências com o design system.
//
// IMPORTANTE (dev): o @originjs/vite-plugin-federation NÃO gera um remoteEntry.js real
// no Vite dev server (ele retorna o index.html para /remoteEntry.js). Por isso os remotes
// devem rodar em modo produção (`vite build` + `vite preview`) e o host aponta para
// /assets/remoteEntry.js, que é onde o build coloca o arquivo.

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'esnext',
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  plugins: [
    react(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        dashboard_mfe: 'dashboard_mfe@http://127.0.0.1:5001/assets/remoteEntry.js',
        profile_mfe: 'profile_mfe@http://127.0.0.1:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    alias: {
      '@design-system': fileURLToPath(new URL('../../packages/design-system/src', import.meta.url)),
      '@shared-utils': fileURLToPath(new URL('../../packages/shared-utils/src', import.meta.url)),
    },
  },
});

