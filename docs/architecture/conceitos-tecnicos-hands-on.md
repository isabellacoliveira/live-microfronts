# Conceitos técnicos para o hands-on

> Material de apoio para apresentar a arquitetura do **Nexo Seguros** sem implementar código ao vivo.
>
> Objetivo: conectar cada conceito a uma evidência visual, a um trecho real do repositório e a uma mensagem simples para a apresentação.

## 1. Visão geral: o que existe de verdade no projeto

O repositório é um **monorepo de microfrontends** com quatro aplicações independentes e pacotes compartilhados:

| Unidade | Tecnologia | Porta | Papel na demonstração |
|---|---:|---:|---|
| `host-react` | React + Vite | 5173 | Portal, navegação, carregamento remoto, loading e fallback |
| `dashboard-mfe-react` | React + Vite | 5001 | Catálogo e contratação de seguros |
| `profile-mfe-react` | React + Vite | 5002 | Cadastro do cliente |
| `notifications-mfe-angular` | Angular + Vite | 5003 | Notificações, isoladas em iframe |
| `design-system` | React/TypeScript | — | Componentes visuais reutilizáveis |
| `shared-utils` | TypeScript | — | Contratos, eventos, estado compartilhado e ponte de iframe |
| `shared-types` | TypeScript | — | Tipos de domínio reutilizáveis |

O fluxo de negócio é propositalmente pequeno: **cadastrar cliente → contratar seguro → consolidar no Host → receber notificação no Angular**. Ele permite demonstrar runtime, autonomia, comunicação e coexistência de frameworks sem depender de um backend.

Veja o diagrama completo em [mfe-communication-flow.md](mfe-communication-flow.md).

---

## 2. Monorepo: várias aplicações, um repositório

### Conceito

Um monorepo reúne aplicações e bibliotecas relacionadas em um único repositório Git. Isso **não transforma automaticamente** as aplicações em um monólito: elas ainda podem ter build, deploy e runtime independentes.

### Como aparece aqui

- [pnpm-workspace.yaml](../../pnpm-workspace.yaml) declara `apps/*` e `packages/*` como workspaces.
- [package.json](../../package.json) centraliza scripts de `build`, `dev` e `lint`.
- [turbo.json](../../turbo.json) descreve dependências e cache das tarefas.

### O que mostrar

Abra a árvore de diretórios e destaque a separação entre `apps` e `packages`.

### Frase para usar

> “O monorepo centraliza a governança e o reuso. A autonomia vem de cada app poder ser compilado, publicado e executado separadamente.”

### Benefícios

- Versionamento coordenado de contratos e bibliotecas.
- Onboarding mais simples: um clone contém o ecossistema.
- Reuso explícito de design system, tipos e utilitários.
- Pipelines podem executar somente o que mudou.

### Trade-offs

- Requer disciplina de fronteiras entre domínios.
- Mudanças em um pacote compartilhado podem impactar vários consumidores.
- CI/CD deve saber detectar e testar os pacotes afetados.

---

## 3. Turborepo: orquestração de tarefas e cache

### Conceito

Turborepo não é um framework de microfrontend. É um orquestrador de tarefas para monorepos: entende dependências entre pacotes, executa trabalhos em ordem e pode reutilizar resultados de cache.

### Como aparece aqui

Em [turbo.json](../../turbo.json):

- `build` depende do build das dependências (`^build`);
- a saída `dist/**` é cacheável;
- `dev` é persistente e sem cache;
- `lint` não gera artefatos.

### O que mostrar

Mostre [turbo.json](../../turbo.json) e explique que a mesma tarefa tem comportamento diferente para build e desenvolvimento.

### Frase para usar

> “Turborepo não carrega MFE no navegador. Ele resolve o problema anterior: como construir e validar muitas aplicações sem executar trabalho desnecessário.”

### Cuidados

Cache só é confiável quando os `inputs`, variáveis de ambiente e `outputs` relevantes estão corretamente declarados. Neste projeto, `dist/**` já está configurado como saída do build.

---

## 4. pnpm workspaces: dependências locais sem publicação

### Conceito

`pnpm` administra dependências de forma eficiente e workspaces permitem que pacotes locais sejam consumidos no mesmo repositório.

### O que mostrar

- [pnpm-workspace.yaml](../../pnpm-workspace.yaml)
- [package.json](../../package.json), que fixa o gerenciador em `pnpm@11.18.0`.

### Frase para usar

> “O workspace permite tratar o design system e os contratos como produtos internos, sem precisar publicar uma versão no registry a cada alteração local.”

### Limite importante

Usar um pacote local facilita o desenvolvimento; não substitui uma política de versionamento e compatibilidade quando os MFEs passam a ser publicados de forma realmente independente.

---

## 5. Vite: servidor de desenvolvimento e pipeline de build

### Conceito

Vite oferece uma experiência de desenvolvimento rápida baseada em módulos ES e usa Rollup no build de produção. No projeto, ele é usado tanto nas aplicações React quanto no MFE Angular.

### Como aparece aqui

- Host: [apps/host-react/vite.config.ts](../../apps/host-react/vite.config.ts)
- Dashboard: [apps/dashboard-mfe-react/vite.config.ts](../../apps/dashboard-mfe-react/vite.config.ts)
- Profile: [apps/profile-mfe-react/vite.config.ts](../../apps/profile-mfe-react/vite.config.ts)
- Notifications: [apps/notifications-mfe-angular/vite.config.mts](../../apps/notifications-mfe-angular/vite.config.mts)

### Ponto técnico interessante

No ambiente de desenvolvimento, o manifesto federado é servido como `/remoteEntry.js`. Após build e preview, ele fica em `/assets/remoteEntry.js`. O Host monta a URL correta a partir do `command` do Vite em [apps/host-react/vite.config.ts](../../apps/host-react/vite.config.ts#L10-L17).

### Frase para usar

> “Vite acelera o ciclo local. Module Federation continua sendo a camada que decide como o Host encontra e carrega um remoto em runtime.”

---

## 6. Microfrontends: autonomia por domínio, não divisão visual aleatória

### Conceito

Microfrontend é uma estratégia para dividir um frontend grande em unidades que podem ter responsabilidade, time e ciclo de entrega próprios. A divisão deve ser orientada a domínio, não a componentes pequenos.

### Divisão deste projeto

| MFE | Domínio | O que ele não deve fazer |
|---|---|---|
| Profile | cadastro do cliente | contratar seguro ou consolidar carteira |
| Insurance Catalog | seleção e contratação | editar perfil ou renderizar notificações |
| Notifications | leitura/gestão local de notificações | conhecer internamente os MFEs React |
| Host | composição da experiência | ser dono da regra de negócio de um domínio |

### O que mostrar

Abra o diagrama em [mfe-communication-flow.md](mfe-communication-flow.md) antes de executar a jornada no navegador.

### Frase para usar

> “A fronteira de um MFE deve acompanhar uma capacidade de negócio que faça sentido para um time manter de ponta a ponta.”

### Quando faz sentido

- Vários times com domínios razoavelmente independentes.
- Necessidade real de deploys independentes.
- Migração gradual entre stacks ou aplicações legadas.
- Produto grande, com governança suficiente para sustentar a complexidade.

### Quando não faz sentido

- Aplicação pequena com um time pequeno.
- Domínios altamente acoplados e liberados sempre juntos.
- Falta de observabilidade, testes integrados, padrões de contratos e operação madura.

---

## 7. Module Federation: composição em runtime

### Conceito

Module Federation permite que uma aplicação carregue módulos expostos por outra aplicação **em runtime**. O Host não precisa ter o código do remoto embutido no seu próprio bundle de build.

No projeto, o plugin é `@originjs/vite-plugin-federation`, uma implementação de Federation para Vite.

### Vocabulário essencial

| Termo | Significado prático |
|---|---|
| Host | Aplicação que consome módulos remotos |
| Remote | Aplicação que disponibiliza módulos para consumo |
| `exposes` | Contrato de módulos que o remote torna público |
| `remotes` | Mapa de remotes que o Host sabe localizar |
| `remoteEntry.js` | Manifesto/entry runtime usado para resolver módulos expostos |
| `shared` | Dependências que Host e remotes tentam reutilizar |
| chunk | Arquivo de código dividido para ser baixado quando necessário |
| runtime loading | Download e execução do módulo no momento de navegação/uso |

### Como aparece aqui

O Dashboard expõe seu `App`:

- [apps/dashboard-mfe-react/vite.config.ts](../../apps/dashboard-mfe-react/vite.config.ts#L21-L32)

O Profile faz o mesmo:

- [apps/profile-mfe-react/vite.config.ts](../../apps/profile-mfe-react/vite.config.ts#L19-L30)

O Host aponta para os dois remotes:

- [apps/host-react/vite.config.ts](../../apps/host-react/vite.config.ts#L28-L35)

E então os importa de forma dinâmica:

- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx#L17-L25)

### O que mostrar no navegador

1. Abra o Host.
2. Abra DevTools > Network.
3. Filtre por `remoteEntry`.
4. Navegue para Cliente ou Catálogo.
5. Mostre a busca do `remoteEntry.js` na porta do remote.

### Frase para usar

> “O Host recebe o contrato de onde está o módulo e só baixa o código do MFE quando aquela rota precisa dele.”

### O que o Module Federation não resolve sozinho

- Modelo de domínio.
- Contratos de eventos.
- Autorização e autenticação.
- Observabilidade distribuída.
- Compatibilidade de API entre versões.
- Estratégia de deploy e rollback.

---

## 8. Lazy loading, `React.lazy` e `Suspense`

### Conceito

Lazy loading atrasa a carga de um módulo até que ele seja necessário. É útil para reduzir o JavaScript inicial e para carregar remotes apenas quando o usuário navega até eles.

### Como aparece aqui

O Host cria o componente remoto com `React.lazy`, exibe `Loading` durante a espera e encapsula a carga em `Suspense`:

- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx#L30-L33)

### Demonstração

Com DevTools aberto, navegue entre Dashboard, Cliente e Catálogo. Relacione o loading da interface com as requisições de rede.

### Frase para usar

> “Lazy loading melhora a carga inicial, mas desloca parte do custo para a navegação. Por isso precisamos de loading, tratamento de erro e uma boa estratégia de cache.”

---

## 9. Dependências compartilhadas, singleton e React duplicado

### Conceito

Host e remotes podem acabar baixando cópias separadas de bibliotecas iguais. Para bibliotecas que mantêm contexto ou estado interno — como React — duas cópias podem causar aumento de bundle e problemas como hooks inválidos.

### Como aparece aqui

Host, Dashboard e Profile declararam `react` e `react-dom` como compartilhados:

- [apps/host-react/vite.config.ts](../../apps/host-react/vite.config.ts#L28-L35)
- [apps/dashboard-mfe-react/vite.config.ts](../../apps/dashboard-mfe-react/vite.config.ts#L22-L32)
- [apps/profile-mfe-react/vite.config.ts](../../apps/profile-mfe-react/vite.config.ts#L20-L30)

### Mensagem precisa para a palestra

> “Neste projeto, React e ReactDOM estão em `shared`. Em uma arquitetura de produção, a configuração de singleton e as versões compatíveis precisam ser validadas explicitamente conforme o runtime de Federation escolhido.”

### Por que não dizer simplesmente que já é singleton

A configuração atual lista dependências em `shared`, mas não declara uma opção explícita de `singleton`. O comportamento e as opções variam entre Webpack Module Federation e plugins de Vite. Portanto, apresente como **compartilhamento de dependência implementado** e como **política de singleton a validar/configurar para produção**.

### Sintomas de duplicação de React

- `Invalid hook call`.
- Contexto de React não atravessa a fronteira esperada.
- Aumento de bundle e downloads redundantes.
- Comportamentos estranhos ao renderizar um remote.

---

## 10. `remoteEntry.js`, chunks e cache

### Conceito

`remoteEntry.js` é o ponto de descoberta do remote. Depois que o Host o carrega, o runtime sabe quais módulos estão expostos e quais chunks adicionais precisam ser buscados.

### Sequência simplificada

1. O usuário acessa uma rota do Host.
2. `React.lazy` inicia o `import()` remoto.
3. O runtime busca o `remoteEntry.js` do remote.
4. O manifesto resolve `./App`.
5. Os chunks necessários são baixados.
6. O componente é renderizado dentro de `Suspense`.

### Cache: por que é relevante

Arquivos com hash podem permanecer em cache por bastante tempo. Se um `remoteEntry` antigo referenciar chunks que já não existem após um deploy, a aplicação pode falhar ao carregar um módulo.

### Como falar de `ChunkLoadError`

> “`ChunkLoadError` normalmente não é um problema de React. É a página pedindo um arquivo de build que não está mais disponível, muitas vezes por cache desalinhado ou deploy não atômico.”

### Mitigações de produção

- Deploy atômico: manifesto e chunks publicados juntos.
- Política de cache curta ou revalidação para o entry/manifests.
- Arquivos de chunk com hash e cache longo.
- Fallback para remote indisponível.
- Observabilidade de falhas de carregamento e estratégia de retry/reload controlado.

---

## 11. Resiliência: loading, Error Boundary e remote indisponível

### Conceito

Se os MFEs são entregues independentemente, uma falha parcial é possível. O produto precisa decidir se uma tela alternativa, uma degradação funcional ou uma indisponibilidade completa é o comportamento adequado.

### Como aparece aqui

O Host possui dois níveis didáticos de proteção:

1. Falha ao importar o remote retorna uma mensagem específica:
   - [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx#L17-L25)
2. Um `ErrorBoundary` protege o container remoto:
   - [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx#L11-L15)
   - [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx#L30-L33)

### Demonstração sugerida

1. Pare somente a aplicação Dashboard na porta 5001.
2. Recarregue o Host.
3. Acesse Catálogo de seguros.
4. Mostre que o portal continua navegável e apresenta fallback no local afetado.

### Frase para usar

> “Autonomia de deploy também cria falha parcial. O Host deve degradar de forma explícita, sem esconder o erro e sem derrubar todo o produto.”

---

## 12. Comunicação entre MFEs: eventos, armazenamento e ponte de iframe

### Princípio

Os MFEs não importam diretamente o código de outro MFE. Eles se integram por **contratos estáveis**, eventos e pontos de comunicação apropriados à fronteira técnica.

O fluxo completo está descrito em [mfe-communication-flow.md](mfe-communication-flow.md).

### 12.1 Custom Events como pub/sub local

#### Conceito

`CustomEvent` permite publicar um evento no `window`; consumidores interessados podem assinar sem o produtor conhecer quem são eles.

#### Como aparece aqui

O wrapper de publicação/assinatura está em:

- [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts#L130-L146)

Eventos de domínio usados no fluxo:

- `customer.updated`
- `insurance.contracted`

Definição em:

- [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts#L10-L13)

#### Jornada real

- Profile publica o cliente: [RegisterCustomerForm.tsx](../../apps/profile-mfe-react/src/features/register-customer/ui/RegisterCustomerForm.tsx#L25-L36).
- Catálogo assina `customer.updated`: [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx#L14-L18).
- Catálogo publica a contratação: [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx#L20-L42).
- Host assina e consolida o contrato: [main.tsx](../../apps/host-react/src/main.tsx#L78-L87).

#### Vantagens

- Baixo acoplamento entre produtor e consumidor.
- Sem dependência de framework.
- Fácil de demonstrar e suficiente para eventos simples no mesmo contexto de janela.

#### Limitações

- Não oferece persistência, replay, ordem garantida ou entrega confiável.
- Pode ficar difícil de rastrear sem telemetria e convenções de nomes/payloads.
- É síncrono no contexto da página.

### 12.2 `sessionStorage`: estado de bootstrap, não estado global distribuído

#### Conceito

Eventos são efêmeros: se um MFE ainda não estava carregado quando o evento ocorreu, ele não o recebe. O `sessionStorage` permite recuperar o último estado dentro da mesma aba.

#### Como aparece aqui

- Leitura: [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts#L56-L71)
- Escrita: [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts#L73-L88)
- O catálogo inicializa o cliente a partir desse estado: [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx#L14-L15)

#### Frase para usar

> “Evento atualiza quem já está ouvindo; storage permite que um MFE carregado depois faça bootstrap do último estado.”

#### Limitações

- Vale apenas para a sessão/aba atual.
- Não substitui backend, banco de dados ou sincronização entre dispositivos.
- Dados sensíveis não devem ser armazenados sem uma análise de segurança.

### 12.3 `postMessage`: ponte entre janelas e runtimes isolados

#### Conceito

`window.postMessage` é apropriado para comunicação entre contextos de janela diferentes, como iframe, popup ou origem distinta.

#### Como aparece aqui

O Host renderiza o Angular em um iframe e encaminha contratos:

- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx#L64-L73)

A abstração reutilizável está em:

- [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts#L150-L178)

O Angular recebe a mensagem e cria notificações em memória:

- [apps/notifications-mfe-angular/src/main.ts](../../apps/notifications-mfe-angular/src/main.ts#L248-L271)

#### O que mostrar

Depois de contratar um seguro, abra Notificações e mostre o badge, a nova mensagem e o filtro de não lidas.

#### Segurança

O exemplo usa `'*'` como `targetOrigin`, exclusivamente por simplicidade didática. Em produção:

- use uma origem exata permitida;
- valide `event.origin` no receptor;
- valide o formato de `event.data`;
- evite encaminhar dados desnecessários ou sensíveis.

### 12.4 URL, props e Context: onde se encaixam

| Mecanismo | Melhor uso | Limite |
|---|---|---|
| URL | rota, identificação, filtros compartilháveis e deep link | não deve carregar dados sensíveis ou payload grande |
| Props | composição direta entre componentes no mesmo runtime | não atravessa sozinho MFEs isolados/iframes |
| React Context | estado compartilhado dentro de uma árvore React | não é um barramento entre aplicações independentes |
| Custom Events | notificações desacopladas na mesma janela | não garante persistência nem entrega |
| Storage | bootstrap local e preferências simples | não substitui fonte de verdade no servidor |
| `postMessage` | iframe, popup, contextos/origens diferentes | exige regras rigorosas de segurança |

---

## 13. React e Angular no mesmo produto

### Conceito

Microfrontends podem apoiar migração tecnológica e permitir que diferentes domínios usem frameworks distintos. Isso não significa que misturar stacks seja gratuito: aumenta a diversidade operacional e a superfície de integração.

### Como aparece aqui

- O Host é React.
- Notifications é Angular standalone, inicializado por `bootstrapApplication` em [apps/notifications-mfe-angular/src/main.ts](../../apps/notifications-mfe-angular/src/main.ts#L276-L276).
- A composição é feita por iframe em [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx#L64-L73).

### Vantagens do iframe neste exemplo

- Isolamento forte de DOM, CSS e runtime.
- Permite mostrar Angular e React sem conflito de dependências.
- Fronteira de integração clara via mensagens.

### Custos

- Comunicação mais verbosa.
- Integração visual, foco, acessibilidade e responsividade exigem cuidado extra.
- Não há compartilhamento natural de contexto React ou dependências.

### Frase para usar

> “O iframe é uma fronteira forte: ganha-se isolamento e perde-se simplicidade de integração. A escolha depende do risco e do cenário de migração.”

---

## 14. Feature-Sliced Design (FSD): organização dentro do MFE

### Conceito

Microfrontend separa domínios entre aplicações. FSD organiza o código **dentro** de cada aplicação, evitando que cada MFE se transforme em outro monólito interno.

### Camadas previstas

| Camada | Papel |
|---|---|
| `app` | composição e configuração da aplicação |
| `pages` | telas de negócio |
| `widgets` | blocos visuais compostos e reutilizáveis |
| `features` | ação/capacidade do usuário |
| `entities` | modelos e regras de conceitos de domínio |
| `shared` | infraestrutura e elementos genéricos |

A especificação completa está em [architecture-spec.md](architecture-spec.md#L56-L75).

### Como aparece no Dashboard

- Modelo e catálogo de seguros: [insurances.ts](../../apps/dashboard-mfe-react/src/entities/insurance/model/insurances.ts)
- Ação de contratar: [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx)
- Página: [CatalogPage.tsx](../../apps/dashboard-mfe-react/src/pages/catalog-page/ui/CatalogPage.tsx)
- Composição: [App.tsx](../../apps/dashboard-mfe-react/src/app/App.tsx)

### Situação atual a explicar com transparência

A estrutura atual demonstra `app`, `pages`, `features` e `entities`. As camadas `widgets` e `shared` dentro de cada MFE estão previstas na especificação, mas não são necessárias para o escopo pequeno atualmente implementado. Os aliases internos de FSD e regras automáticas de fronteira também são uma evolução prevista, não algo demonstrado integralmente pelo código atual.

### Frase para usar

> “MFE resolve a fronteira entre domínios; FSD ajuda a manter cada domínio legível quando ele cresce.”

---

## 15. Design system: consistência sem duplicar UI básica

### Conceito

Um design system centraliza primitives, tokens e regras de interação/visual para que cada time mantenha consistência sem copiar componentes.

### Como aparece aqui

O pacote exporta componentes, tema e tokens:

- [packages/design-system/src/index.ts](../../packages/design-system/src/index.ts)

Componentes disponíveis incluem `Button`, `Card`, `Input`, `Badge` e `Loading`:

- [packages/design-system/src/components/index.ts](../../packages/design-system/src/components/index.ts)

Exemplo de primitive compartilhada:

- [packages/design-system/src/components/Button.tsx](../../packages/design-system/src/components/Button.tsx)

### O que mostrar

Abra o `Button` e depois volte ao Host, Profile e Catálogo para localizar o mesmo componente sendo consumido em contextos diferentes.

### Frase para usar

> “Cada MFE decide sua experiência de domínio, mas não precisa reinventar botão, card, input e tokens visuais.”

### Trade-off

O design system é uma dependência compartilhada importante. Sua evolução requer versionamento, changelog, testes visuais e uma política clara para mudanças incompatíveis.

---

## 16. Contratos TypeScript e compatibilidade

### Conceito

A comunicação entre MFEs precisa de contratos explícitos. TypeScript ajuda a validar o payload no desenvolvimento, mas não valida automaticamente dados recebidos em runtime.

### Como aparece aqui

- Tipos reutilizáveis de domínio: [packages/shared-types/src/index.ts](../../packages/shared-types/src/index.ts)
- Tipos usados pela comunicação do exemplo: [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts#L15-L42)

O contrato mais relevante é `InsuranceContract`, que contém cliente, seguro, data e status.

### Frase para usar

> “Evento sem contrato vira acoplamento escondido. Tipo compartilhado deixa a intenção explícita, mas produção também precisa validar a mensagem em runtime.”

### Boas práticas para evolução

- Prefira mudanças aditivas e campos opcionais em eventos já publicados.
- Versione contratos ou inclua uma versão no envelope da mensagem quando necessário.
- Evite remover/renomear campos sem período de compatibilidade.
- Valide payload externo com schema runtime, por exemplo Zod, JSON Schema ou equivalente.

---

## 17. Webpack: conceito importante, mas não é o bundler implementado

### Ponto de transparência

A especificação cita Webpack porque ele é a referência original de Module Federation. **O runtime implementado neste repositório usa Vite e `@originjs/vite-plugin-federation`; não há configuração Webpack ativa nas aplicações.**

### Como explicar Webpack mesmo assim

No Webpack, o `ModuleFederationPlugin` configura:

- `name`: identificação da aplicação;
- `filename`: normalmente `remoteEntry.js`;
- `exposes`: módulos publicados pelo remote;
- `remotes`: módulos consumidos pelo Host;
- `shared`: bibliotecas que podem ser reutilizadas;
- opções como `singleton`, `requiredVersion` e `eager`.

O pipeline conceitual é o mesmo demonstrado no projeto: manifest/entry remoto, resolução de módulo, download de chunks e execução em runtime.

### Comparação honesta: Webpack x Vite neste hands-on

| Tema | Webpack Module Federation | Vite + plugin Federation deste projeto |
|---|---|---|
| Papel | Implementação de referência/original | Implementação usada no código |
| Configuração | `ModuleFederationPlugin` | `@originjs/vite-plugin-federation` |
| Dev server | Bundler/dev server Webpack | Vite com módulos ES |
| Build | Webpack gera bundles/chunks | Vite/Rollup gera build; plugin adiciona a federação |
| Conceitos de runtime | `remoteEntry`, exposes, remotes, shared | Mesmos conceitos apresentados aqui |
| Opções avançadas | Ecossistema mais maduro e documentado | Devem ser avaliadas conforme o plugin e a versão |

### Frase para usar

> “Webpack é a referência conceitual de Module Federation; Vite é a implementação escolhida aqui para uma experiência de desenvolvimento mais simples. Os princípios são equivalentes, mas a API e as capacidades avançadas não devem ser tratadas como idênticas.”

---

## 18. Deploy independente, versionamento e CORS

### Deploy independente

Um MFE só é de fato independente quando pode ser construído, publicado e revertido sem obrigar todos os demais a serem republicados. O `remoteEntry` precisa apontar para uma versão compatível e disponível.

### Problemas típicos

| Problema | Sintoma | Prevenção |
|---|---|---|
| Remote fora do ar | erro ao importar ou fallback exibido | health checks, fallback e observabilidade |
| URL antiga no Host | Host não encontra entry remoto | catálogo/versionamento de remotes, rollback |
| Cache desalinhado | `ChunkLoadError` | deploy atômico e cache correto para manifesto/chunks |
| Contrato incompatível | UI quebra ou interpreta dado errado | compatibilidade retroativa e validação runtime |
| CORS mal configurado | browser bloqueia entry/chunk | cabeçalhos e origens permitidas explicitamente |

### CORS

Em ambiente local, todos os endpoints usam `127.0.0.1` em portas distintas. Em produção, domínio, CDN, headers e origem do iframe precisam ser configurados deliberadamente.

### Frase para usar

> “A parte mais difícil de microfrontend não é carregar um remoto. É operar versões, cache, contratos e falhas parciais com segurança.”

---

## 19. Limites atuais do hands-on

Este projeto é deliberadamente didático. Apresente os itens abaixo como simplificações conscientes:

- Não há backend, autenticação, autorização ou persistência real.
- A carteira consolidada fica no estado local do Host; ao recarregar, ela reinicia.
- O `sessionStorage` só recupera o último estado compartilhado na mesma aba.
- A lista de notificações Angular fica em memória.
- A comunicação de retorno do Angular para o Host é enviada pelo botão, mas o Host não a exibe/trata visualmente hoje.
- O `postMessage` usa `'*'`, inadequado para produção sem validação de origem.
- Não há simulação implementada de versões incompatíveis, CORS bloqueado, React duplicado ou `ChunkLoadError`; estes são conceitos para explicar ou evoluções possíveis do hands-on.
- Não há Webpack configurado ativamente; a comparação com Webpack é conceitual.

A transparência melhora a apresentação: o público entende exatamente o que é prova de conceito e o que seria necessário endurecer em produção.

---

## 20. Sequência recomendada para mostrar tudo sem escrever código

1. **Arquitetura (3 min):** abra [mfe-communication-flow.md](mfe-communication-flow.md) e mostre os quatro papéis.
2. **Monorepo e automação (3 min):** abra [pnpm-workspace.yaml](../../pnpm-workspace.yaml) e [turbo.json](../../turbo.json).
3. **Module Federation (5 min):** compare `remotes` no Host com `exposes` no Dashboard e Profile.
4. **Jornada de negócio (8 min):** cadastro → catálogo → contratação → dashboard → notificações.
5. **Eventos e storage (4 min):** abra [communication.ts](../../packages/shared-utils/src/communication.ts) e conecte cada evento à jornada recém-executada.
6. **Angular no iframe (3 min):** mostre o `postMessage` e o listener Angular.
7. **Design system e FSD (3 min):** abra `Button`, depois as camadas do Dashboard.
8. **Resiliência e operação (4 min):** demonstre o fallback ou explique remote indisponível, cache, versão e CORS.
9. **Fechamento (2 min):** “microfrontend é uma decisão organizacional e operacional, não só uma técnica de frontend.”

---

## 21. Checklist antes da apresentação

- Execute `./dev.sh` para buildar e iniciar todos os previews.
- Confirme as portas com `./dev.sh status`.
- Abra o Host em `http://127.0.0.1:5173/`.
- Faça uma passagem completa: cadastro, contratação, dashboard e notificação.
- Abra DevTools e deixe a aba Network pronta com filtro `remoteEntry`.
- Prepare uma janela anônima ou recarregue a página antes de demonstrar remote indisponível.
- Evite chamar `sessionStorage` de banco de dados ou `shared` de singleton sem verificar/configurar isso explicitamente.
- Mostre os limites do exemplo como decisões didáticas, não como defeitos escondidos.
