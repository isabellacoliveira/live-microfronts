import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// Configuração do host para consumo de remotes.
// Responsabilidade: carregar os MFEs em runtime e compartilhar dependências com o design system.
//
// Em DEV: o remoteEntry.js fica na raiz do dev server (/remoteEntry.js).
// Em PRODUÇÃO (build/preview): o remoteEntry.js fica em /assets/remoteEntry.js.
// O plugin usa o `command` do Vite para escolher a URL correta automaticamente.

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const remoteEntry = (port: number) =>
    `http://127.0.0.1:${port}${isDev ? '/remoteEntry.js' : '/assets/remoteEntry.js'}`;

  return {
    server: {
      port: 5173,
      strictPort: true,
    },
    build: {
      target: "esnext",
    },
    esbuild: {
      supported: {
        "top-level-await": true,
      },
    },
    plugins: [
      react(),
      federation({
        name: "host",
        filename: "remoteEntry.js",
        remotes: {
          dashboard_mfe: remoteEntry(5001),
          profile_mfe: remoteEntry(5002),
        },
        shared: ["react", "react-dom"],
      }),
    ],
    resolve: {
      alias: {
        "@design-system": fileURLToPath(
          new URL("../../packages/design-system/src", import.meta.url),
        ),
        "@shared-utils": fileURLToPath(
          new URL("../../packages/shared-utils/src", import.meta.url),
        ),
      },
    },
  };
});
