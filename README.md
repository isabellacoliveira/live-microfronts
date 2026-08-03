# Live Microfronts

<!--
Este projeto é uma base didática para uma palestra sobre microfrontends, Module Federation e Feature-Sliced Design.
Ele foi organizado como um monorepo com host, remotes e packages compartilhados para demonstrar os conceitos de forma prática.
-->

## Visão geral

Este repositório mostra uma arquitetura de referência para um cenário hands-on de microfrontends com:
- React como base para o host e alguns remotes;
- um design system compartilhado;
- contratos e utilidades compartilhadas;
- uma estrutura preparada para evoluir com Webpack, Vite e Module Federation.

## Passo a passo para a apresentação

### 1. Abrir o contexto da palestra
- Comece explicando o problema do monólito frontend: acoplamento, equipe grande, deploy difícil e baixa autonomia.
- Mostre a estrutura do monorepo e diga que o host é simples e os MFEs são responsáveis por domínios específicos.

### 2. Rodar a base do projeto
1. Instale as dependências:
   - `corepack pnpm install`
2. Inicie o host:
   - `corepack pnpm --filter host-react exec vite --host 127.0.0.1 --port 5173`
3. Inicie os remotes:
   - `corepack pnpm --filter dashboard-mfe-react exec vite --host 127.0.0.1 --port 5001`
   - `corepack pnpm --filter profile-mfe-react exec vite --host 127.0.0.1 --port 5002`
   - `corepack pnpm --filter notifications-mfe-angular exec vite --host 127.0.0.1 --port 5003`
4. Acesse o host em `http://127.0.0.1:5173/`.

### 3. Demonstrar o host
- Mostre que o host não tem regra de negócio, apenas orquestra o carregamento.
- Clique nos botões de navegação e mostre a troca de contexto.
- Explique que o host é responsável por routing, loading e fallback.

### 4. Mostrar a arquitetura
- Abra os arquivos de configuração Vite e destaque:
  - `apps/host-react/vite.config.ts`
  - `apps/dashboard-mfe-react/vite.config.ts`
  - `apps/profile-mfe-react/vite.config.ts`
- Explique o papel de `remoteEntry.js`, `exposes`, `remotes` e `shared`.

### 5. Demonstrar a comunicação entre MFEs
- Mostre o utilitário em `packages/shared-utils/src/communication.ts`.
- Clique no host e mostre que uma mensagem é enviada via evento.
- Explique trade-offs: eventos simples, mas não são a melhor solução para tudo.

### 6. Mostrar o Design System compartilhado
- Abra `packages/design-system/src`.
- Explique que o host e os MFEs usam o mesmo conjunto de componentes base para manter consistência visual.

### 7. Conversar sobre problemas reais
- Mostre o cenário de remote indisponível e explique o fallback.
- Explique por que o singleton e o compartilhamento de dependências importam.
- Comente sobre cache, versionamento e deploy independente.

### 8. Fechar a palestra
- Reforce quando microfrontend faz sentido.
- Reforce quando não faz sentido.
- Termine com a ideia central: arquitetura precisa ser escolhida com base em autonomia, escalabilidade e clareza operacional.

## Pontos de palestra
- Monólito vs microfrontend.
- Feature-Sliced Design.
- Module Federation e remoteEntry.
- Shared dependencies e singleton.
- Comunicação entre MFEs.
- Problemas reais: remote indisponível, chunk load error, cache e versionamento.

## Validação
- O host compila corretamente com:
  - `corepack pnpm --filter host-react exec tsc --noEmit -p tsconfig.json`
