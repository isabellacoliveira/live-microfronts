# Roteiro da Apresentação — Microfrontends com Module Federation

<!--
Este roteiro organiza a palestra em slides e momentos práticos.
Ele alterna entre conceito, código, execução, arquitetura, debug e deploy.
-->

## Slide 1 — Abertura
- Objetivo: contextualizar o problema.
- O que falar: monólitos frontend, crescimento de equipes e necessidade de autonomia.
- Código para mostrar: nenhum ou um exemplo simples de monólito.
- Tempo estimado: 5 minutos.
- Demonstração prática: mostrar uma tela monolítica grande e explicar a complexidade.
- Perguntas possíveis: quando um monólito começa a ficar custoso?

## Slide 2 — Evolução da arquitetura frontend
- Objetivo: mostrar a transição de monólito para módulos e MFEs.
- O que falar: evolução de camadas, domínios e autonomia.
- Código para mostrar: diagrama de arquitetura e um exemplo conceitual.
- Tempo estimado: 5 minutos.
- Demonstração prática: comparar arquitetura monolítica e modular.
- Perguntas possíveis: qual é a fronteira para separar um módulo?

## Slide 3 — Feature-Sliced Design
- Objetivo: explicar organização de código.
- O que falar: app, pages, widgets, features, entities, shared.
- Código para mostrar: estrutura de uma pasta de feature.
- Tempo estimado: 8 minutos.
- Demonstração prática: mostrar onde um componente deve ficar.
- Perguntas possíveis: por que um componente vai para widgets e não features?

## Slide 4 — Microfrontends
- Objetivo: introduzir o conceito.
- O que falar: independência, deploy, ownership, limites.
- Código para mostrar: visão geral do monorepo com host e remotes.
- Tempo estimado: 8 minutos.
- Demonstração prática: abrir o projeto e mostrar os remotes.
- Perguntas possíveis: isso substitui arquitetura de módulos?

## Slide 5 — Module Federation
- Objetivo: mostrar a ideia central.
- O que falar: runtime composition, compartilhamento de dependências e carregamento remoto.
- Código para mostrar: configuração de ModuleFederationPlugin.
- Tempo estimado: 10 minutos.
- Demonstração prática: explicar remoteEntry.js e exposes.
- Perguntas possíveis: como o host encontra um remoto?

## Slide 6 — Webpack em detalhes
- Objetivo: explicar a execução interna.
- O que falar: bundles, chunks, remoteEntry, runtime loading, cache.
- Código para mostrar: configuração clássica do Webpack.
- Tempo estimado: 12 minutos.
- Demonstração prática: mostrar build e analisar chunks.
- Perguntas possíveis: por que um chunk é criado separadamente?

## Slide 7 — Vite Module Federation
- Objetivo: mostrar a abordagem equivalente no Vite.
- O que falar: diferenças e semelhanças com Webpack.
- Código para mostrar: configuração do plugin de Module Federation para Vite.
- Tempo estimado: 8 minutos.
- Demonstração prática: rodar o projeto e mostrar o comportamento do dev server.
- Perguntas possíveis: qual abordagem é mais adequada para meu time?

## Slide 8 — Design System compartilhado
- Objetivo: mostrar a camada compartilhada de UI.
- O que falar: consistência visual, tokens e componentes base.
- Código para mostrar: Button, Card, Modal e Theme.
- Tempo estimado: 7 minutos.
- Demonstração prática: mostrar um componente renderizado em dois MFEs diferentes.
- Perguntas possíveis: como evitar divergência visual?

## Slide 9 — Comunicação entre MFEs
- Objetivo: apresentar as opções.
- O que falar: props, context, events, URL, storage e pub/sub.
- Código para mostrar: exemplos simples de cada abordagem.
- Tempo estimado: 12 minutos.
- Demonstração prática: toggle de tema ou atualização de notificação.
- Perguntas possíveis: qual padrão escolher em produção?

## Slide 10 — Problemas reais e debug
- Objetivo: demonstrar falhas comuns.
- O que falar: React duplicado, singleton ausente, remote indisponível, ChunkLoadError, CORS, incompatibilidade de versão, cache e deploy.
- Código para mostrar: exemplos de erros e logs de desenvolvimento.
- Tempo estimado: 12 minutos.
- Demonstração prática: simular um erro de carregamento remoto.
- Perguntas possíveis: como identificar a causa mais rapidamente?

## Slide 11 — Deploy e escalabilidade
- Objetivo: conectar arquitetura com operação.
- O que falar: deploy independente, versionamento, separação de times e impacto no pipeline.
- Código para mostrar: fluxo de build e publicação.
- Tempo estimado: 8 minutos.
- Demonstração prática: mostrar como um MFE pode ser entregue separadamente.
- Perguntas possíveis: quando microfrontend deixa de ser uma boa ideia?

## Slide 12 — Encerramento
- Objetivo: consolidar o aprendizado.
- O que falar: resumo das decisões, trade-offs e boas práticas.
- Código para mostrar: nenhum ou um resumo arquitetural.
- Tempo estimado: 5 minutos.
- Demonstração prática: revisar a arquitetura final e reforçar os aprendizados.
- Perguntas possíveis: quais são os próximos passos para aplicar isso na prática?
