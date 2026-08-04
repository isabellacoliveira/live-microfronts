import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

// Configuração do Vite para o MFE Angular.
// Responsabilidade: servir um microfrontend Angular independente (porta 5003),
// consumido pelo host via iframe (isolamento por iframe).

export default defineConfig({
  server: {
    port: 5003,
    strictPort: true,
  },
  plugins: [angular()],
  build: {
    target: 'esnext',
  },
});
