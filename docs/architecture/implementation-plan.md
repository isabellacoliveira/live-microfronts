# Plano de Implementação por Etapas

<!--
Este plano define a ordem recomendada para construir o projeto.
Cada etapa deve terminar com compilação válida antes da próxima começar.
-->

## Fase 0 — Aprovação da especificação
- Objetivo: validar documentação arquitetural.
- Entregável: consenso sobre estrutura, stack e roteiro da palestra.
- Critério de saída: todos os pontos da especificação aprovados.

## Fase 1 — Estrutura base do monorepo
- Objetivo: criar a base com pnpm e Turborepo.
- Entregáveis:
  - workspace raiz;
  - apps e packages iniciais;
  - configuração de TypeScript;
  - configuração de ESLint e Prettier.
- Critério de saída: o monorepo inicial compila semanticamente e mantém a organização proposta.

## Fase 2 — Design System compartilhado
- Objetivo: criar a base visual compartilhada.
- Entregáveis:
  - componentes base;
  - tokens e tema;
  - exportações do package design-system.
- Critério de saída: host e MFEs conseguem consumir o design-system sem duplicação.

## Fase 3 — Host simples
- Objetivo: construir o host com responsabilidade mínima.
- Entregáveis:
  - roteamento;
  - loading;
  - fallback;
  - error boundary;
  - carregamento remoto.
- Critério de saída: o host consegue carregar um MFE remoto sem regras de negócio.

## Fase 4 — Dashboard MFE React
- Objetivo: implementar uma experiência visual simples com FSD.
- Entregáveis:
  - estrutura FSD;
  - cards e indicadores;
  - integração com design-system.
- Critério de saída: o dashboard funciona isoladamente e pode ser carregado pelo host.

## Fase 5 — Profile MFE React
- Objetivo: implementar a experiência de usuário e preferências.
- Entregáveis:
  - estrutura FSD;
  - formulário e preferências;
  - integração com shared-types e shared-utils.
- Critério de saída: o profile é independente e pode ser consumido via host.

## Fase 6 — Notifications MFE Angular
- Objetivo: adicionar um microfrontend Angular em coexistência com React.
- Entregáveis:
  - estrutura Angular compatível com o monorepo;
  - lista, badge e configurações;
  - integração com o host.
- Critério de saída: o host carrega o Angular e o React lado a lado.

## Fase 7 — Comunicação entre MFEs
- Objetivo: demonstrar padrões concretos de comunicação.
- Entregáveis:
  - custom events;
  - props e context;
  - URL e storage;
  - pub/sub.
- Critério de saída: a palestra consegue demonstrar trade-offs de cada abordagem.

## Fase 8 — Cenários reais de falha
- Objetivo: preparar exemplos didáticos de problemas.
- Entregáveis:
  - remote indisponível;
  - ChunkLoadError;
  - React duplicado;
  - singleton ausente;
  - versions incompatíveis;
  - cache e deploy quebrado.
- Critério de saída: o projeto consegue explicar e reproduzir esses cenários.

## Fase 9 — Polimento e documentação
- Objetivo: transformar o projeto em material de estudo.
- Entregáveis:
  - README explicativo;
  - comentários educacionais no código;
  - instruções de execução;
  - roteiro de palestra final.
- Critério de saída: o repositório já está pronto para ser usado em uma palestra técnica.
