# Roteiro de apresentação — Live Microfronts (1 hora)

Este roteiro foi montado com base apenas no que já existe no repositório e no que já está implementado ou documentado de forma concreta.

## Objetivo da apresentação
Apresentar, de forma didática, como funciona uma arquitetura de microfrontends com Module Federation, usando este repositório como exemplo prático.

## O que já dá para mostrar com o que existe aqui
- Um monorepo com host e MFEs separados.
- Um host simples que orquestra o carregamento de remotes.
- Dois microfrontends React já representados no projeto: dashboard e profile.
- Um design system compartilhado.
- Uma camada de utilidades compartilhadas para comunicação simples entre partes do sistema.
- Configurações de Vite/Module Federation que mostram o fluxo de runtime e compartilhamento.

## Estrutura sugerida da apresentação (60 minutos)

### 1. Abertura e contexto — 5 minutos
- Objetivo: situar o problema e despertar interesse.
- O que dizer:
  - "Frontend monolítico pode crescer demais e virar um problema de autonomia e deploy."
  - "Quando há muitas equipes e muitos domínios, separar partes da interface vira uma estratégia interessante."
  - "Este repositório mostra um exemplo didático de como pensar isso sem perder clareza."
- O que mostrar:
  - O README inicial e a visão geral do projeto.
  - A estrutura do monorepo.
- Slide sugerido:
  - "Por que microfrontends?"

### 2. Apresentar o projeto e a arquitetura — 8 minutos
- Objetivo: explicar a visão geral do repositório.
- O que dizer:
  - "O projeto está organizado como um monorepo com apps e packages."
  - "O host é responsável por orquestrar. Os remotes representam domínios específicos."
  - "A ideia é mostrar arquitetura, runtime e organização sem exagerar na complexidade."
- O que mostrar:
  - A estrutura do workspace.
  - Os diretórios principais: apps/ e packages/.
  - A diferença entre host, MFEs e packages compartilhados.
- Slide sugerido:
  - "Arquitetura do projeto"

### 3. Mostrar o host e o seu papel — 8 minutos
- Objetivo: explicar que o host é simples e não concentra regra de negócio.
- O que dizer:
  - "O host não deve ter regra de negócio. Ele deve carregar, roteirizar e mostrar fallback."
  - "Neste projeto, o host é um orquestrador de experiência."
- O que mostrar:
  - O arquivo [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx)
  - O comportamento de navegação por hash.
  - O loading e o fallback.
- Slide sugerido:
  - "O host é apenas o orquestrador"

### 4. Mostrar os microfrontends React — 10 minutos
- Objetivo: demonstrar que existem domínios separados e independentes.
- O que dizer:
  - "O dashboard e o profile são exemplos de MFEs com responsabilidades diferentes."
  - "Cada um pode evoluir sem depender diretamente do host para sua lógica visual básica."
- O que mostrar:
  - O componente do dashboard em [apps/dashboard-mfe-react/src/App.tsx](../../apps/dashboard-mfe-react/src/App.tsx)
  - O componente do profile em [apps/profile-mfe-react/src/App.tsx](../../apps/profile-mfe-react/src/App.tsx)
  - A ideia de que cada MFE tem uma responsabilidade visual e funcional específica.
- Slide sugerido:
  - "Dois remotes, duas responsabilidades"

### 5. Explicar Module Federation e Vite — 10 minutos
- Objetivo: mostrar o conceito central da demonstração.
- O que dizer:
  - "O host carrega módulos remotos em runtime."
  - "O remote expõe módulos e o host consome esses módulos."
  - "A configuração com Vite mostra como isso é feito na prática."
- O que mostrar:
  - O arquivo [apps/host-react/vite.config.ts](../../apps/host-react/vite.config.ts)
  - A configuração de remotes e shared no host.
  - A ideia de remoteEntry, exposes e shared dependencies.
- Slide sugerido:
  - "Como o host encontra e carrega os remotes"

### 6. Mostrar o design system compartilhado — 7 minutos
- Objetivo: mostrar que a consistência visual pode ser mantida entre aplicações diferentes.
- O que dizer:
  - "O design system centraliza componentes, tema e tokens."
  - "Isso evita duplicação e ajuda a manter a identidade visual do produto."
- O que mostrar:
  - A pasta [packages/design-system/src](../../packages/design-system/src)
  - Componentes como Button, Card e Input.
- Slide sugerido:
  - "UI compartilhada para manter consistência"

### 7. Demonstrar comunicação simples entre partes do sistema — 7 minutos
- Objetivo: mostrar que há integração entre host e remotes, mesmo com separação.
- O que dizer:
  - "A comunicação entre MFEs precisa ser pensada com cuidado."
  - "Neste exemplo, a comunicação acontece por eventos simples via window.dispatchEvent."
  - "É um padrão didático e simples, útil para demonstrar o conceito."
- O que mostrar:
  - O utilitário em [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts)
  - A integração no host em [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx)
- Slide sugerido:
  - "Comunicação entre partes do sistema"

### 8. Problemas reais, trade-offs e fechamento — 5 minutos
- Objetivo: encerrar com reflexão crítica.
- O que dizer:
  - "Microfrontend resolve problemas de autonomia, mas traz preocupação com runtime, compatibilidade, fallback e organização."
  - "A arquitetura certa depende do contexto do time, do produto e da maturidade da equipe."
- O que mostrar:
  - O fallback e o loading do host.
  - A ideia de que o projeto é uma base didática, não uma solução pronta para todos os cenários.
- Slide sugerido:
  - "Quando faz sentido e quando não faz"

## Sugestão de slides (10 slides)

1. Título: "Live Microfronts"
   - Subtítulo: um exemplo prático de microfrontends com Module Federation.

2. "Por que microfrontends?"
   - Monólito, autonomia, crescimento de times, deploy e manutenção.

3. "Arquitetura do projeto"
   - Host, remotes e packages compartilhados.

4. "O host é o orquestrador"
   - Carregamento, routing simples, loading e fallback.

5. "Dashboard MFE"
   - Responsabilidade visual e de destaque.

6. "Profile MFE"
   - Perfil, formulário e experiência específica.

7. "Module Federation com Vite"
   - remoteEntry, remotes, shared e runtime loading.

8. "Design System compartilhado"
   - Consistência visual e componentes reutilizáveis.

9. "Comunicação entre partes"
   - Eventos simples e integração entre host e remotes.

10. "Trade-offs e conclusão"
   - Quando microfrontend faz sentido e quais cuidados tomar.

## Falas-guia para a apresentação

### Introdução
"Hoje eu vou mostrar um repositório didático que representa uma arquitetura de microfrontends com host, remotes e componentes compartilhados. O foco aqui não é só a implementação, mas a ideia de como separar responsabilidades e manter a experiência coesa."

### Transição para a arquitetura
"O projeto está organizado em um monorepo. O host fica responsável por carregar e orquestrar, enquanto os MFEs assumem domínios específicos."

### Transição para a parte técnica
"A parte mais interessante é o runtime: o host carrega módulos remotos e isso traz vantagens de autonomia, mas também exige atenção para compartilhamento, fallback e compatibilidade."

### Fechamento
"O ponto central é que microfrontend não é uma resposta automática para todo problema. Ele faz sentido quando há autonomia, escalabilidade e clareza operacional."

## Observação importante
Este roteiro foi pensado para o que já está realmente presente no projeto hoje: estrutura, host, remotes, design system compartilhado, utilitários de comunicação e configuração de runtime. Ele evita inventar funcionalidades que ainda não estão demonstradas de forma prática.
