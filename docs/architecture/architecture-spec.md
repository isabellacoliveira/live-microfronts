# Especificação Arquitetural — Hands-on Microfrontends

<!--
Este documento é a base de especificação do projeto.
Ele define o que o projeto deve ensinar, como deve ser organizado e quais decisões arquiteturais serão priorizadas.
Não implementa código ainda; serve como contrato para a execução do trabalho.
-->

## 1. Propósito do projeto

Este repositório será usado como material de palestra técnica para demonstrar, de forma prática e didática, quando vale a pena usar microfrontends e como o Module Federation funciona internamente.

O projeto deve ser:
- funcional o suficiente para demonstrar runtime e comunicação;
- bem organizado para servir como estudo;
- didático para explicar conceitos e trade-offs;
- preparado para evoluir em etapas sem perder clareza.

## 2. Objetivos de aprendizagem

A palestra deve ensinar:
- por que monólitos frontend podem ficar difíceis de escalar;
- como evoluir de uma arquitetura monolítica para uma arquitetura modular;
- o papel do Feature-Sliced Design na organização de código;
- o que são microfrontends e quando eles fazem sentido;
- como Module Federation funciona com Webpack e com Vite;
- como compartilhar dependências e evitar duplicação de bibliotecas;
- como usar singleton, lazy loading e runtime loading;
- como conduzir comunicação entre MFEs de forma segura e compreensível;
- como pensar em deploy, versionamento e organização de times.

## 3. Stack principal

- React
- Angular
- TypeScript
- Vite
- Module Federation
- Webpack
- pnpm
- Turborepo
- ESLint
- Prettier

## 4. Estrutura do monorepo

```text
apps/
  host-react/
  dashboard-mfe-react/
  profile-mfe-react/
  notifications-mfe-angular/
packages/
  design-system/
  shared-types/
  shared-utils/
  eslint-config/
```

### Responsabilidade de cada pasta

- apps/host-react: aplicação hospedeira, simples e responsável por roteamento, carregamento de remotes e fallback.
- apps/dashboard-mfe-react: microfrontend de dashboard com componentes visuais e dados agregados.
- apps/profile-mfe-react: microfrontend de perfil com dados do usuário, edição e preferências.
- apps/notifications-mfe-angular: microfrontend de notificações com lista, badge e configurações.
- packages/design-system: biblioteca compartilhada de UI com tokens, temas e componentes base.
- packages/shared-types: contratos TypeScript compartilhados entre apps e packages.
- packages/shared-utils: utilidades reutilizáveis, como formatters, helpers e wrappers de comunicação.
- packages/eslint-config: configuração centralizada de linting.

## 5. Feature-Sliced Design

Todos os MFEs React devem seguir Feature-Sliced Design.

Cada MFE deve ter as pastas:
- app/
- pages/
- widgets/
- features/
- entities/
- shared/

### Responsabilidade por camada

- app/: composição da aplicação, providers, rotas e configuração global.
- pages/: páginas de negócio que organizam a experiência completa.
- widgets/: blocos visuais compostos que juntam features e entities em uma unidade reutilizável.
- features/: ações e capacidades do usuário, como editar perfil, filtrar notificações ou trocar tema.
- entities/: modelos e regras de negócio relacionados a um conceito central, como usuário, dashboard e notificação.
- shared/: infraestrutura reutilizável, utilidades, UI base e constantes.

### Regra didática importante

Um componente deve ir para widgets quando representa uma unidade visual e composta, que pode ser reutilizada em diferentes páginas.
Ele deve ir para features quando representa uma ação ou comportamento do usuário.

## 6. Regras de organização de imports

O projeto deve ter aliases claros para evitar imports inválidos.

Exemplos esperados:
- @app/*
- @pages/*
- @widgets/*
- @features/*
- @entities/*
- @shared/*
- @design-system/*
- @shared-types/*
- @shared-utils/*

Além disso, deve haver regras de linting para impedir:
- imports de camadas superiores por camadas inferiores;
- imports diretos de páginas dentro de widgets;
- imports de features dentro de shared;
- dependências implícitas entre MFEs.

## 7. Papel do Host

O host deve ser extremamente simples.

Sua única responsabilidade deve ser:
- carregar os MFEs;
- definir roteamento;
- exibir loading;
- exibir fallback;
- capturar erros com error boundary.

Nenhuma regra de negócio deve existir no host.

## 8. Microfrontends

### Dashboard MFE (React)
- cards de métricas;
- indicadores;
- gráficos simples;
- área de destaque para dados agregados.

### Profile MFE (React)
- visualização de usuário;
- edição de dados básicos;
- preferências de visualização.

### Notifications MFE (Angular)
- lista de notificações;
- badge de contador;
- configurações de preferências.

Cada MFE deve ser independente, com sua própria estrutura interna e com responsabilidades bem delimitadas.

## 9. Module Federation

A implementação deve explicar detalhadamente os seguintes conceitos:

- remoteEntry.js: ponto de entrada remoto que expõe módulos para outros apps.
- ModuleFederationPlugin: plugin responsável por declarar remotes, exposes, shared dependencies e chunks.
- shared: dependências compartilhadas entre host e remotes.
- singleton: garante uma única instância de uma dependência compartilhada.
- eager: carrega dependências logo no início.
- lazy: carrega módulos sob demanda.
- chunks: divisões de código geradas para runtime loading.
- exposes: módulos remotos disponibilizados ao host.
- remotes: módulos consumidos pelo host.
- consumo remoto: carregamento dinâmico de módulos remotos.
- versionamento: compatibilidade de versões entre host e remoto.
- fallback: tratamento de remotes indisponíveis ou com erro.

## 10. Webpack

O conteúdo didático deve explicar passo a passo:
- como o Webpack cria bundles;
- como gera chunks;
- como produz remoteEntry.js;
- como o host encontra um remote;
- como o runtime faz o download e execução do módulo;
- como cache e chunking influenciam a performance.

## 11. Vite

O projeto deve mostrar a implementação equivalente com Vite usando o plugin de Module Federation.

A explicação deve comparar:
- diferenças de configuração;
- diferenças no ciclo de build e runtime;
- impacto na experiência de desenvolvimento;
- vantagens e limitações de cada abordagem.

## 12. Design System compartilhado

O design-system deve fornecer componentes e tokens reutilizáveis:
- Button
- Input
- Card
- Modal
- Loading
- Badge
- Theme
- Tokens

O objetivo é demonstrar que todos os MFEs utilizam exatamente o mesmo conjunto de UI primitives.

## 13. Estratégias de comunicação

O projeto deve demonstrar diferentes formas de comunicação entre partes do sistema:

- Custom Events
- window.dispatchEvent
- Props
- Context
- URL
- Storage
- Pub/Sub

Cada abordagem deve ter:
- explicação de quando usar;
- vantagens;
- desvantagens;
- exemplo prático no projeto.

## 14. Problemas reais a demonstrar

O projeto deve incluir exemplos didáticos de:
- React duplicado;
- singleton ausente;
- remote indisponível;
- ChunkLoadError;
- CORS;
- versões incompatíveis;
- deploy quebrado;
- falha de cache.

Cada caso deve ter uma explicação clara de diagnóstico e solução.

## 15. Fluxo de trabalho

O desenvolvimento deve seguir este fluxo:
1. especificar e documentar;
2. validar arquitetura;
3. implementar uma etapa por vez;
4. testar cada etapa antes de prosseguir;
5. manter o projeto coerente para a palestra.

## 16. Critério de aprovação

A implementação só deve prosseguir após a aprovação desta especificação.

A aprovação deve confirmar:
- estrutura de monorepo;
- divisão dos MFEs;
- estratégia de compartilhamento;
- abordagem de comunicação;
- roteiro de palestra.

## 17. Observação final

Este projeto deve servir como referência técnica e como guia de estudo.
A prioridade é clareza didática, organização arquitetural e demonstrabilidade prática, não apenas funcionalidade superficial.
