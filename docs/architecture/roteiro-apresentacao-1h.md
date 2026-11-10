# Roteiro prático de aula — Microfrontends

Este roteiro parte do princípio de que a teoria já foi explicada. A ideia agora é provar os conceitos olhando a aplicação rodando e seguindo o código que implementa cada comportamento.

## Preparação antes da aula

Siga o [guia de execução dos MFEs](../guia-execucao-mfes.md) para buildar e iniciar os previews. Deixe abertos:

- Host: <http://127.0.0.1:5173/>
- Catálogo: porta `5001`
- Cliente: porta `5002`
- Notificações Angular: porta `5003`

No navegador, abra o DevTools na aba **Network**, marque **Disable cache** e deixe o filtro pronto para `remoteEntry`. No VS Code, deixe as abas indicadas em cada etapa à mão.

> O Angular é opcional para a demonstração principal. Ele é carregado por iframe, não por Module Federation.

## Sequência da demonstração

| Etapa | Tempo | Conceito demonstrado |
|---|---:|---|x
| 1. Reconhecer Host e Remotes na aplicação | 3 min | Shell / Host / Remote |
| 2. Acompanhar o carregamento sob demanda | 7 min | Dynamic Loading, Module Federation e `remoteEntry.js` |
| 3. Seguir uma mudança de domínio | 8 min | Limites entre MFEs e compartilhamento |
| 4. Acompanhar um contrato e a comunicação | 10 min | Eventos entre MFEs |
| 5. Ver montagem, desmontagem e isolamento | 5 min | Ciclo de vida e iframe |
| 6. Provocar e recuperar uma falha | 5 min | Fallback e resiliência |
| 7. Fechar com boas práticas aplicadas | 2 min | Boas práticas |

---

## 1. Reconhecer Host e Remotes na aplicação — 3 min

**Conceito demonstrado:** o Host compõe a experiência; cada Remote entrega uma área de domínio.

**Arquivos para abrir**

- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx)
- [apps/dashboard-mfe-react/src/App.tsx](../../apps/dashboard-mfe-react/src/App.tsx)
- [apps/profile-mfe-react/src/App.tsx](../../apps/profile-mfe-react/src/App.tsx)

**O que fazer**

1. Abra o Host e mostre a navegação lateral: Dashboard, Cliente, Catálogo de seguros e Notificações.
2. Clique em **Cliente** e depois em **Catálogo de seguros**.
3. No código do Host, localize `Route`, `labels`, `navigate` e `content`.
4. Mostre que cada `App.tsx` do Remote delega a tela para a página do seu domínio.

**Fala sugerida**

> “Aqui eu consigo trocar de domínio sem trocar de aplicação visual: a navegação continua no Host, enquanto o conteúdo de Cliente e Catálogo vem de MFEs diferentes. O Host compõe a experiência, mas não implementa o formulário nem a regra de contratação.”

---

## 2. Acompanhar o carregamento sob demanda — 7 min

**Conceito demonstrado:** Dynamic Loading, configuração de Module Federation e busca de `remoteEntry.js`.

**Arquivos para abrir**

- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx), em `remoteLoaders`, `LazyRemotes` e `RemoteContainer`
- [apps/host-react/vite.config.ts](../../apps/host-react/vite.config.ts), em `remotes` e `shared`
- [apps/dashboard-mfe-react/vite.config.ts](../../apps/dashboard-mfe-react/vite.config.ts), em `name`, `filename` e `exposes`

**O que fazer**

1. No navegador, volte ao Dashboard e recarregue a página com o DevTools aberto.
2. Na aba **Network**, observe que os recursos do catálogo não são necessários para desenhar o Dashboard inicial.
3. Clique em **Catálogo de seguros**. Filtre por `remoteEntry` e mostre a requisição do remote do catálogo.
4. No código do Remote, mostre que `./App` é exposto. No Host, mostre o `import("dashboard_mfe/App")`.
5. Se o `remoteEntry` aparecer em `/assets/remoteEntry.js`, explique que essa é a URL de preview configurada para o Host. Em modo dev, o caminho é `/remoteEntry.js`.

**Fala sugerida**

> “A rota aciona um import lazy. O Host resolve o nome `dashboard_mfe/App` usando a configuração de remotes; o remote declara que `./App` é sua entrada pública. No Network dá para ver o primeiro contato com o `remoteEntry.js` e, depois, os arquivos necessários para renderizar o Catálogo.”

**Ponto de atenção ao demonstrar**

Se a resposta do `remoteEntry.js` for HTML ou 404, não é uma falha visual do Catálogo: o Host não recebeu o artefato de federação esperado. Confira o modo, o build e as portas no [guia de execução](../guia-execucao-mfes.md).

---

## 3. Do cadastro ao compartilhamento — cerca de 8 min

**Conceitos demonstrados:** onde fica o formulário, o que acontece ao salvar, como os componentes visuais são reutilizados e o que a configuração `shared` faz.

Esta parte reúne coisas diferentes. Pense em três perguntas:

1. **Dados:** o que acontece quando clicamos em Salvar?
2. **Visual:** de onde vêm o botão e os campos do formulário?
3. **Ferramenta:** como a configuração de Module Federation trata React e React DOM?

### 3.1. Salvar o formulário e acompanhar os dados

**Arquivos para abrir**

- [Formulário de cadastro](../../apps/profile-mfe-react/src/features/register-customer/ui/RegisterCustomerForm.tsx)
- [Utilitários de comunicação](../../packages/shared-utils/src/communication.ts)
- [Catálogo de seguros](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx)

**O que fazer e dizer**

1. No navegador, abra **Cliente**. Mostre os campos preenchidos e clique em **Salvar cadastro**. A mensagem “Cadastro salvo com sucesso” deve aparecer.

   > “Esse formulário é a responsabilidade do MFE Cliente. O Host mostra a tela, mas é o MFE que sabe o que fazer quando clicamos em Salvar.”

2. No **Formulário de cadastro**, procure `const submit`. Aponte as linhas abaixo, seguindo a ordem:

   ```tsx
   const customer: Customer = { id: 'customer-isabella', ...values };
   ```

   > “Aqui juntamos os dados dos campos em um objeto chamado `customer`. Os três pontinhos colocam no objeto os valores preenchidos no formulário. Neste exemplo, o ID é fixo e os dados são de demonstração.”

   ```tsx
   setSharedState({
     text: `Cliente atualizado: ${customer.name}`,
     source: 'customer-mfe',
     scope: 'customer',
     customer,
   });
   ```

   > “Aqui guardamos o cliente em um estado compartilhado. É como deixar uma anotação para outra tela consultar depois. Neste projeto, essa anotação fica no `sessionStorage` do navegador; não é um cadastro enviado para um banco de dados.”

   ```tsx
   publish(INSURANCE_EVENTS.customerUpdated, customer);
   setSuccess(true);
   ```

   > “Depois, publicamos um aviso chamado `customer.updated`, levando os dados do cliente. Quem estiver ouvindo esse evento naquele momento pode reagir. Por último, `setSuccess(true)` faz o formulário mostrar a confirmação.”

3. Nos **Utilitários de comunicação**, procure `setSharedState` e a chamada `window.sessionStorage.setItem`. Em seguida, procure `publish` e `window.dispatchEvent`. Não é necessário ler a implementação inteira: mostre apenas onde a anotação é guardada e onde o aviso é enviado.

   > “São duas coisas diferentes: o armazenamento guarda um valor para consulta posterior; o evento é um aviso para quem estiver escutando naquele instante. O `setSharedState` também publica um evento próprio de mudança de estado; `customer.updated` é publicado separadamente pelo formulário.”

4. No navegador, abra **Catálogo de seguros**. O nome do cliente salvo deve aparecer. No código do **Catálogo**, procure `getSharedState().customer` no `useState` e a assinatura `subscribe(...customerUpdated...)` no `useEffect`.

   > “Como nesta demonstração o Catálogo abre depois de salvar o Cliente, ele lê a anotação que já estava no `sessionStorage`. Se o Catálogo estiver montado e receber o evento enquanto escuta, a assinatura atualiza o cliente. Um evento que já passou não é reproduzido automaticamente.”

**Conferência opcional:** no DevTools, abra **Application → Session Storage → `http://127.0.0.1:5173`** e procure a chave `live-microfronts:shared-state`. Após salvar, o valor deve conter `customer`. Mostre apenas dados fictícios: esse armazenamento fica no navegador da aba.

### 3.2. Mostrar de onde vêm os componentes visuais

**Arquivos para abrir**

- [Formulário de cadastro](../../apps/profile-mfe-react/src/features/register-customer/ui/RegisterCustomerForm.tsx)
- [Button.tsx do design system](../../packages/design-system/src/components/Button.tsx)
- [Configuração Vite do Cliente](../../apps/profile-mfe-react/vite.config.ts)

**O que fazer e dizer**

1. No formulário, aponte o import `import { Button, Card, Input } from '@design-system'`. Depois procure `<Button type="submit">` e `<Input ... />`.

   > “Em vez de cada tela desenhar um botão e um campo do zero, o formulário usa componentes visuais prontos do design system.”

2. Abra **Button.tsx** e mostre o `<button>` e seus estilos. Volte ao navegador e aponte o botão **Salvar cadastro**.

   > “Este arquivo define o componente que o formulário usa. A vantagem é manter o mesmo padrão visual e reaproveitar código.”

3. Abra a **configuração Vite do Cliente** e procure `resolve` → `alias` → `@design-system`. Mostre que ele aponta para `../../packages/design-system/src`.

   > “`@design-system` é um apelido para essa pasta do projeto. Assim, no import, escrevemos um nome curto em vez de um caminho comprido. O Vite resolve esse apelido durante o build.”

### 3.3. Diferenciar o alias de `shared`

**Arquivo para abrir:** [configuração Vite do Host](../../apps/host-react/vite.config.ts).

**O que fazer e dizer**

1. Mostre primeiro `resolve.alias`, onde o Host também define `@design-system`. Depois localize, dentro de `federation`, a linha:

   ```ts
   shared: ["react", "react-dom"],
   ```

2. Compare as duas configurações:

   | No código | Pergunta que responde | Exemplo neste projeto |
   |---|---|---|
   | `alias` | “Onde encontro este código quando vejo esse nome no import?” | `@design-system` aponta para a pasta do design system. |
   | `federation.shared` | “Quais dependências são declaradas para compartilhamento pelo runtime de Federation?” | `react` e `react-dom`. |

   > “O nome `@design-system` ajuda o Vite a encontrar os componentes visuais durante o build. Já `shared` faz parte da configuração de Module Federation e declara React e React DOM para compartilhamento entre Host e remotes. Uma coisa não significa a outra: o design system é reutilizado por código do monorepo, mas não está na lista `shared` desta configuração.”

**Para não prometer além do código:** aparecer em `shared` não garante, por si só, uma única instância de React em qualquer cenário. Versões e comportamento do runtime precisam ser compatíveis e verificados.






---

## 4. Acompanhar um contrato e a comunicação — 10 min

**Conceito demonstrado:** comunicação desacoplada por eventos de domínio e consumo no Host.

**Arquivos para abrir**

- [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts), em `INSURANCE_EVENTS`, `publish`, `subscribe` e `setSharedState`
- [apps/profile-mfe-react/src/features/register-customer/ui/RegisterCustomerForm.tsx](../../apps/profile-mfe-react/src/features/register-customer/ui/RegisterCustomerForm.tsx)
- [apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx)
- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx), na assinatura de `insurance.contracted` e no `PortalDashboard`

**O que fazer**

1. Com o cadastro salvo, abra **Catálogo de seguros**. Mostre que o Catálogo reconhece o cliente.
2. Clique em **Contratar seguro**.
3. No Catálogo, mostre `publish(INSURANCE_EVENTS.insuranceContracted, insuranceContract)`.
4. No Host, mostre a assinatura de `insurance.contracted` e a atualização do estado `contracts`.
5. Abra **Dashboard** e mostre o contrato na visão consolidada.
6. Volte ao código do Catálogo e mostre que o `useEffect` assina `customer.updated` e retorna a função de unsubscribe.

**Fala sugerida**

> “O Cliente guarda os dados e publica `customer.updated`. Como abrimos o Catálogo depois, nesta demonstração ele encontra o cliente salvo no estado compartilhado; se já estiver escutando quando o evento ocorrer, também pode reagir ao aviso. Depois, o Catálogo publica `insurance.contracted`, e o Host, que está ouvindo, atualiza sua visão consolidada. O Catálogo não precisa importar o código do Cliente.”

**O que destacar**

O evento desacopla o produtor do consumidor, mas o nome e o formato do payload continuam sendo um contrato. Mudanças nesse contrato precisam ser coordenadas e testadas.

---

## 5. Ver montagem, desmontagem e isolamento — cerca de 5 min

**Conceito demonstrado:** o Host monta e desmonta o componente React remoto; o Angular deste projeto aparece em uma página separada, dentro de um iframe.

### Antes de começar: o que significam esses nomes?

Imagine que uma tela é uma peça que colocamos e retiramos de um palco:

| Nome | Em palavras simples | Exemplo neste projeto |
|---|---|---|
| **Bootstrap** | Preparar e iniciar uma aplicação. | Quando o Catálogo abre sozinho, seu `main.tsx` cria uma raiz React. |
| **Mount** | Colocar um componente na interface. | Ao abrir a rota Catálogo no Host, React monta o componente remoto na árvore do Host. |
| **Unmount** | Retirar o componente da interface e executar suas limpezas. | Ao trocar de Catálogo para Dashboard, o componente do Catálogo é desmontado e deixa de escutar seu evento. |

> **Não confunda:** esses são nomes para explicar etapas do ciclo de vida. Este projeto **não implementa** um contrato de MFE com funções próprias chamadas `bootstrap()`, `mount()` e `unmount()`. No caminho federado React, a montagem e a desmontagem são feitas pelo React.

**Arquivos para abrir**

- [main.tsx do Host](../../apps/host-react/src/main.tsx): `content`, `LazyRemotes`, `RemoteContainer` e `NotificationsFrame`
- [main.tsx do Catálogo](../../apps/dashboard-mfe-react/src/main.tsx): inicialização quando ele roda sozinho
- [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx): assinatura do evento
- [communication.ts](../../packages/shared-utils/src/communication.ts): funções `subscribe` e `subscribeMessage`
- [main.ts do Angular](../../apps/notifications-mfe-angular/src/main.ts): inicialização da aplicação Angular
- [notifications.component.ts](../../apps/notifications-mfe-angular/src/app/notifications.component.ts): `ngOnInit` e `ngOnDestroy`

### Passo 1 — Montagem: entrar no Catálogo pelo Host

**O que fazer**

1. Abra o portal no navegador e selecione **Catálogo de seguros**.
2. No [main.tsx do Host](../../apps/host-react/src/main.tsx), procure o trecho que decide o conteúdo da rota:

   ```tsx
   if (route === "customer" || route === "catalog")
     return <RemoteContainer route={route} />;
   ```

3. No mesmo arquivo, procure `RemoteContainer`:

   ```tsx
   const Component = LazyRemotes[route];
   return (
     <ErrorBoundary fallback={<Card>Não foi possível carregar este microfrontend.</Card>}>
       <Suspense fallback={<Loading />}>
         <Component />
       </Suspense>
     </ErrorBoundary>
   );
   ```

4. Aponte `LazyRemotes.catalog`, que usa `React.lazy(remoteLoaders.catalog)`, e o `import("dashboard_mfe/App")` dentro de `remoteLoaders`.

**O que está acontecendo**

```text
Clique em Catálogo
       ↓
Host escolhe <RemoteContainer route="catalog" />
       ↓
React.lazy resolve o módulo remoto quando necessário
       ↓
React monta o componente do Catálogo dentro da árvore do Host
```

Enquanto o módulo está sendo resolvido, `Suspense` pode mostrar `Loading`. Depois, o componente remoto é renderizado na mesma árvore React do Host.

**Fala sugerida**

> “Ao clicar em Catálogo, o Host escolhe esse RemoteContainer. Ele seleciona o componente do Catálogo e o React o coloca na interface. Esse momento de colocá-lo na árvore é o mount. O Catálogo federado não abre uma página separada.”

### Passo 2 — Desmontagem: sair do Catálogo e limpar a assinatura

**Primeiro, a ideia sem código**

Imagine que o Catálogo liga um rádio para ouvir o canal `customer.updated`. Quando alguém publica uma atualização de cliente nesse canal, o Catálogo pode atualizar os dados na tela.

Quando saímos do Catálogo, ele não está mais na tela. Então precisamos **desligar o rádio**: remover a assinatura daquele evento. Se deixarmos assinaturas antigas ativas, poderemos acumular ouvintes desnecessários ao voltar várias vezes à tela.

### 2.1. Onde o Catálogo liga o rádio?

**Abra:** [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx). Encontre:

```tsx
useEffect(() => subscribe<Customer>(INSURANCE_EVENTS.customerUpdated, setCustomer), []);
```

Essa linha é curta, mas faz bastante coisa:

- `useEffect`: pede ao React que execute uma ação associada ao ciclo de vida do componente.
- `subscribe`: registra o interesse em um evento; é como ligar o rádio.
- `INSURANCE_EVENTS.customerUpdated`: o nome do canal, `customer.updated`.
- `setCustomer`: a função chamada com os dados do cliente quando o evento chega enquanto a assinatura está ativa.
- `[]`: o efeito não depende de valores que mudam durante a renderização; na montagem ele é configurado e, ao desmontar, sua limpeza é executada. Em desenvolvimento, o React `StrictMode` pode executar configuração e limpeza extras para detectar problemas.

**Fala sugerida**

> “Quando o Catálogo entra na tela, ele começa a ouvir `customer.updated`. Se esse aviso chegar enquanto ele está ouvindo, `setCustomer` atualiza o cliente exibido.”

### 2.2. Onde fica o botão de desligar?

**Abra:** [communication.ts](../../packages/shared-utils/src/communication.ts). Procure `subscribeMessage`:

```ts
window.addEventListener(eventName, handler);
return () => window.removeEventListener(eventName, handler);
```

Leia as duas linhas separadamente:

1. `addEventListener` **começa a escutar** o evento com aquele `handler`.
2. O `return` devolve uma **função** que, quando for chamada, executará `removeEventListener` com o mesmo evento e handler.

**Atenção:** criar e retornar essa função **não a executa imediatamente**. É como entregar um botão de desligar, para ser usado depois.

Logo abaixo, mostre que `subscribe` devolve o resultado de `subscribeMessage`. Assim, quando o Catálogo chama `subscribe(...)`, recebe essa função de limpeza.

**Fala sugerida**

> “A primeira linha liga a escuta. A segunda não desliga na mesma hora: ela devolve uma função que sabe desligar exatamente essa escuta quando for chamada.”

### 2.3. Como o React recebe essa função?

Volte à linha original no [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx):

```tsx
useEffect(() => subscribe<Customer>(INSURANCE_EVENTS.customerUpdated, setCustomer), []);
```

Ela usa uma forma curta de função: sem chaves depois de `=>`, o resultado de `subscribe(...)` é retornado automaticamente. Para explicar, imagine a **mesma ideia escrita de forma mais longa**:

```tsx
useEffect(() => {
  const pararDeEscutar = subscribe<Customer>(
    INSURANCE_EVENTS.customerUpdated,
    setCustomer,
  );

  return pararDeEscutar;
}, []);
```

Esse trecho é **apenas uma versão explicativa equivalente**, não precisa substituir o código do projeto.

**Fala sugerida**

> “O `subscribe` me devolve a função de parar de escutar. Eu entrego essa função ao React pelo retorno do `useEffect`. Assim, o React sabe o que limpar quando esse componente sair da tela.”

### 2.4. O que fazer na demonstração?

1. No navegador, abra **Catálogo de seguros**. Mostre o código do `useEffect`: o Catálogo passou a ouvir o evento.
2. Volte ao navegador e clique em **Dashboard**.
3. No [main.tsx do Host](../../apps/host-react/src/main.tsx), mostre que a rota Dashboard renderiza `PortalDashboard` em vez de `RemoteContainer`. O Catálogo deixa a árvore React.
4. Explique que o React chama a função de limpeza retornada pelo efeito, que remove a assinatura do Catálogo.
5. Se desejar observar a execução, coloque um breakpoint na linha de `addEventListener` e outro na função com `removeEventListener` em [communication.ts](../../packages/shared-utils/src/communication.ts). Abra novamente o Catálogo e depois vá para Dashboard. Outros componentes também usam essas funções: confira no depurador o nome do evento `customer.updated`.

```text
ABRIR CATÁLOGO                          ABRIR DASHBOARD
      │                                        │
      ▼                                        ▼
React monta o Catálogo                  React desmonta o Catálogo
      │                                        │
      ▼                                        ▼
subscribe liga a escuta                React chama a função de limpeza
      │                                        │
      ▼                                        ▼
devolve a função de desligar           removeEventListener desliga a escuta
```

**Fala de fechamento**

> “Entrou na tela? O Catálogo começa a escutar. Saiu da tela? O React executa a limpeza e ele para de escutar. Não estamos desligando o evento para todo mundo, apenas removendo o listener daquela assinatura do Catálogo.”

**Importante para a aula:** a interface mostra a troca de tela, mas não mostra diretamente o listener sendo removido; os breakpoints ajudam a comprovar a limpeza. Desmontar o Catálogo também **não apaga necessariamente o JavaScript ou os chunks já carregados**: ao voltar, o navegador pode reutilizá-los.

### Passo 3 — Bootstrap do Catálogo quando ele roda sozinho

**O que fazer**

1. Abra [main.tsx do Catálogo](../../apps/dashboard-mfe-react/src/main.tsx) e mostre:

   ```tsx
   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <DashboardApp />
     </React.StrictMode>
   );
   ```

2. Se o preview do Catálogo estiver ativo, abra `http://127.0.0.1:5001/` diretamente em outra aba.
3. Compare essa página com o Catálogo aberto dentro do Host.

**Fala sugerida**

> “Quando abro o endereço do Catálogo diretamente, ele precisa iniciar sua própria aplicação: cria uma raiz React no elemento `root` e renderiza seu componente. Quando o Host carrega o Catálogo via Federation, ele usa o `App` exposto como componente da própria árvore; não executa esse `main.tsx` standalone.”

### Passo 4 — Angular no iframe: outra página, outro ciclo

**O que fazer**

1. No [main.tsx do Host](../../apps/host-react/src/main.tsx), mostre que `route === "notifications"` renderiza `NotificationsFrame`. Dentro dele, aponte:

   ```tsx
   <iframe
     ref={iframeRef}
     title="Notifications MFE (Angular)"
     src="http://127.0.0.1:5003/"
   />
   ```

2. Abra **Notificações** no Host. O navegador carrega a página Angular dentro do iframe.
3. No [main.ts do Angular](../../apps/notifications-mfe-angular/src/main.ts), mostre:

   ```ts
   bootstrapApplication(NotificationsComponent);
   ```

4. Se houver tempo, abra [notifications.component.ts](../../apps/notifications-mfe-angular/src/app/notifications.component.ts) e compare `ngOnInit`, que registra listeners, com `ngOnDestroy`, que os remove.
5. Ao sair da rota **Notificações**, o React remove o iframe da tela. O efeito de `NotificationsFrame` também limpa o intervalo usado para enviar contratos. A página do iframe é descartada; **não dependa de `ngOnDestroy` ser chamado no fechamento do documento** para ações essenciais.

**Fala sugerida**

> “O Angular aqui entra de outra maneira: o Host mostra um iframe, e o navegador abre a página Angular dentro dele. Essa página inicializa seu próprio componente com `bootstrapApplication`. O Angular tem seus próprios hooks para criar e limpar recursos, mas o iframe é uma escolha deste projeto — Angular não exige iframe.”

**Para fechar a comparação**

```text
React federado: Host → módulo remoto → componente na árvore React do Host
Angular aqui:    Host → iframe        → outro documento e aplicação Angular
```

Para mais detalhes sobre essa escolha e a comunicação entre as janelas, use [Por que o Angular aparece em um iframe?](angular-no-iframe.md).

---

## 6. Provocar e recuperar uma falha — 5 min

**Conceito demonstrado:** fallback, isolamento de falha e diagnóstico pelo Network.

**Arquivos para abrir**

- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx), em `remoteLoaders`, `ErrorBoundary` e `RemoteContainer`
- [apps/host-react/vite.config.ts](../../apps/host-react/vite.config.ts), em `remotes`

**O que fazer**

1. Deixe o preview do Catálogo rodando em seu terminal.
2. Pare **somente esse preview**, com `Ctrl+C` no terminal em que ele está rodando.
3. Recarregue o Host e tente abrir **Catálogo de seguros**. Mostre a mensagem de fallback.
4. No DevTools, mostre a requisição que falhou para o remote.
5. Reinicie o preview do Catálogo com `corepack pnpm --filter dashboard-mfe-react preview`.
6. Recarregue o Host e confirme que o Catálogo volta a carregar.

**Fala sugerida**

> “O processo do Host continua funcional mesmo quando um Remote está fora do ar. O conteúdo daquela rota falha de forma localizada e o fallback informa o problema. Na prática, a mensagem ajuda o usuário, mas logs e monitoramento também são necessários para a equipe diagnosticar a causa.”

**Plano B:** se preferir não parar o processo durante a aula, mostre o bloco de fallback no código e uma requisição de remote indisponível previamente capturada.

---

## 7. Fechar com boas práticas aplicadas — 2 min

**Conceito demonstrado:** boas práticas verificáveis no próprio fluxo.

**Arquivos para abrir**

- [apps/host-react/src/pages/architecture-page/ui/ArchitecturePage.tsx](../../apps/host-react/src/pages/architecture-page/ui/ArchitecturePage.tsx)
- [apps/host-react/src/main.tsx](../../apps/host-react/src/main.tsx)
- [packages/shared-utils/src/communication.ts](../../packages/shared-utils/src/communication.ts)

**O que fazer**

1. Abra a seção **Arquitetura** do Host como resumo visual.
2. Aponte loading/fallback, imports lazy, contratos de evento e limpeza da assinatura.
3. Reforce que a tela Angular usa iframe e que mensagens entre janelas devem validar origem e payload em produção.

**Fala sugerida**

> “O que vimos na prática são boas práticas pequenas, mas importantes: carregar sob demanda, limitar a falha ao Remote, manter contratos explícitos e limpar assinaturas no unmount. Em produção também precisamos de observabilidade, compatibilidade de versões, validação de mensagens e pipelines independentes.”

## Checklist rápido para amanhã

- [ ] Os previews estão rodando nas portas `5173`, `5001`, `5002` e, se for demonstrar Angular, `5003`.
- [ ] O Host abre em `http://127.0.0.1:5173/`.
- [ ] O cadastro pode ser salvo e o Catálogo reconhece o cliente.
- [ ] Contratar um seguro atualiza o Dashboard.
- [ ] O DevTools está aberto em **Network** com filtro `remoteEntry`.
- [ ] O terminal do Catálogo está fácil de identificar para o teste de indisponibilidade.
- [ ] O [guia de execução](../guia-execucao-mfes.md) está disponível como plano de recuperação.
