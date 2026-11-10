# Por que o Angular aparece em um iframe?

## A resposta em uma frase

> **Angular não precisa de iframe.** Neste projeto, escolhemos iframe para demonstrar uma forma de incorporar uma aplicação Angular inteira dentro de um Host React.

São coisas diferentes:

- **Angular** é um framework para construir aplicações.
- **iframe** é um elemento do navegador que exibe outro documento HTML dentro da página.
- **Module Federation** é um mecanismo para disponibilizar e carregar módulos entre builds. Não é sinônimo de iframe.

Uma aplicação Angular pode participar de uma arquitetura de microfrontends **com ou sem iframe**. A melhor escolha depende dos requisitos e dos custos de integração.

---

## 1. Primeiro, olhe para a tela

Imagine o portal como uma casa:

```text
┌──────────────────────────────────────────────────────────┐
│ HOST REACT: a casa                                       │
│ Cabeçalho + menu + área de conteúdo                       │
│                                                          │
│  Dashboard     → tela do próprio Host                    │
│  Cliente       → componente React carregado por Federation│
│  Catálogo      → componente React carregado por Federation│
│  Notificações  → página Angular dentro de um iframe      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

O nome da pasta do Catálogo é `dashboard-mfe-react`, mas ele representa o **Catálogo de seguros**. O Dashboard apresentado no menu é uma tela do próprio Host. Portanto, neste projeto há **dois remotes React federados**, não três.

### Pergunta para a turma

> “Se tudo aparece na mesma tela, tudo é a mesma aplicação?”

**Resposta:** visualmente parece um portal só. Mas o Host compõe partes de maneiras diferentes: os remotes React entram como componentes na árvore React; o Angular aparece como outro documento dentro de um iframe.

---

## 2. Compare os dois caminhos

```text
CAMINHO A — CLIENTE / CATÁLOGO REACT

  Host React
      │ import("profile_mfe/App") ou import("dashboard_mfe/App")
      ▼
  Module Federation encontra o remoteEntry.js e o módulo exposto
      ▼
  React renderiza o componente remoto na árvore do Host


CAMINHO B — NOTIFICAÇÕES ANGULAR

  Host React
      │ renderiza <iframe src="http://127.0.0.1:5003/" />
      ▼
  Navegador abre outro documento dentro do iframe
      ▼
  A aplicação Angular inicializa e renderiza suas notificações
```

**Aqui está a diferença central:** no primeiro caminho, o Host carrega um **módulo**; no segundo, o navegador abre uma **página**. O Angular do exemplo não é declarado como remote federado no Host.

> **Fala sugerida:** “Mesma experiência para a pessoa usuária, duas formas diferentes de compor a interface. O iframe é uma escolha deste exemplo, não uma exigência do Angular.”

---

## 3. Por que escolher iframe neste exemplo?

O objetivo didático é mostrar a convivência de duas tecnologias e contrastar duas formas de integração. O iframe permite que a aplicação Angular seja iniciada e renderizada como uma página própria, enquanto o React apenas reserva um espaço para mostrá-la.

```text
┌───────────────────────────── HOST ─────────────────────────────┐
│ Documento principal: React                                    │
│                                                                │
│     ┌────────────── IFRAME ────────────────────────────┐       │
│     │ Outro documento e outra janela                    │       │
│     │ Aplicação Angular de notificações                │       │
│     └──────────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────────────┘
```

Em termos práticos, isso dá ao Angular seu próprio documento e runtime. O Host não precisa transformar um componente Angular em componente React para exibi-lo.

**Mas existe um custo:** por serem contextos de janela diferentes, a comunicação, o redimensionamento, a navegação e outros detalhes de experiência precisam ser planejados. Não podemos presumir que eventos disparados em uma janela apareçam automaticamente na outra.

### Iframe é uma barreira de segurança?

O iframe cria uma separação de documento e janela, mas **não deve ser tratado como proteção completa por si só**. O isolamento depende de origem, permissões e atributos como `sandbox`, entre outros cuidados.

Neste projeto local, `127.0.0.1:5173` e `127.0.0.1:5003` têm **origens diferentes** porque as portas são diferentes. As restrições de mesma origem do navegador continuam se aplicando.

---

## 4. Mostre o caminho real no código

### Passo 1 — O Host escolhe a rota

**Abra:** [main.tsx do Host](../../apps/host-react/src/main.tsx).

Procure o bloco que calcula `content`:

```tsx
if (route === "notifications")
  return <NotificationsFrame contracts={contracts} />;
```

**Fala sugerida:**

> “Quando escolhemos Notificações, o Host não faz um `import` do componente Angular. Ele renderiza um componente React chamado `NotificationsFrame`, que prepara o iframe.”

### Passo 2 — O iframe aponta para a aplicação Angular

No mesmo arquivo, procure `NotificationsFrame` e mostre:

```tsx
<iframe
  ref={iframeRef}
  title="Notifications MFE (Angular)"
  src="http://127.0.0.1:5003/"
```

**Fala sugerida:**

> “O `src` é o endereço da página Angular. O navegador carrega essa página dentro do espaço reservado pelo Host. A porta 5003 precisa estar respondendo.”

O `src` atual usa `127.0.0.1` e é apropriado para a demonstração local. Um deploy precisaria configurar um endereço acessível pelo navegador da pessoa usuária e permitir a incorporação pela política do servidor.

### Passo 3 — O Angular inicializa sua própria aplicação

**Abra:** [main.ts do Angular](../../apps/notifications-mfe-angular/src/main.ts).

```ts
bootstrapApplication(NotificationsComponent);
```

**Fala sugerida:**

> “Quando a página do iframe carrega, o próprio Angular inicializa o componente raiz dele. Não é o React renderizando um componente Angular como se fosse React.”

O servidor e o build dessa aplicação estão em [vite.config.mts do Angular](../../apps/notifications-mfe-angular/vite.config.mts).

---

## 5. Como Host e Angular conversam?

Pense no `postMessage` como um **bilhete entre janelas**:

```text
HOST REACT                                   IFRAME ANGULAR
janela principal                             outra janela

contratos no estado do Host
        │
        │ postMessage({ channel, payload })
        ├──────────────────────────────────────→ listener de "message"
        │                                        lê insuranceContracts
        │                                        cria notificações
```

### Acompanhe um contrato de ponta a ponta

**Antes:** inicie os quatro previews conforme o [guia de execução](../guia-execucao-mfes.md).

1. Abra o Host e cadastre o cliente.
2. No **Catálogo de seguros**, contrate um seguro.
3. Abra **Dashboard** e mostre o contrato na visão do Host.
4. Abra **Notificações**. O Angular deve apresentar uma notificação do seguro contratado.
5. No [main.tsx do Host](../../apps/host-react/src/main.tsx), encontre `NotificationsFrame` e mostre o envio de `insuranceContracts`.
6. Abra [communication.ts](../../packages/shared-utils/src/communication.ts) e mostre a função `postMessageToIframe`.
7. Abra [notifications.component.ts](../../apps/notifications-mfe-angular/src/app/notifications.component.ts) e procure `ngOnInit`, onde o Angular adiciona o listener `message`, e `handleBridgeMessage`, onde lê os contratos e cria as notificações.

**Fala sugerida:**

> “O Catálogo avisa o Host sobre o contrato. Depois, o Host envia os contratos para a janela do iframe usando `postMessage`. O Angular escuta essa mensagem e transforma os contratos em notificações. São etapas separadas: não é o React importando o código do Angular.”

### Um detalhe que ajuda a explicar o código

O Host envia os contratos imediatamente e repete o envio a cada 1,2 segundo enquanto a tela está montada. Isso ajuda no caso de o iframe ainda não estar pronto no primeiro envio. Ao sair da tela, o intervalo é limpo. O Angular evita criar novamente notificações com o mesmo ID.

O Angular também envia algumas mensagens ao parent pelo seu `publishToParent`, mas **neste fluxo o Host não as consome**. A demonstração de contratos acima é do Host para o Angular.

### Atenção para produção

O exemplo usa `'*'` como destino do `postMessage`, e o receptor verifica o canal, mas não valida a origem da mensagem nem faz validação completa do payload. Para produção, defina a origem de destino esperada e valide `event.origin`, a fonte quando aplicável e o formato dos dados antes de processá-los. Esses cuidados são especialmente importantes para informações sensíveis.

---

## 6. E se o Host e o MFE fossem Angular?

Também seria possível integrá-los **sem iframe**, por exemplo com uma configuração apropriada de Module Federation e carregamento de módulos ou rotas Angular.

```text
Host Angular
    │
    │ carrega módulo / rota remota
    ▼
MFE Angular
```

Isso é um **cenário possível**, não é o que este repositório implementa. Continuariam sendo necessários planejamento de versões, contratos, deploy, carregamento e tratamento de falhas.

---

## 7. React + Angular sem iframe: é possível?

Sim. O React não renderiza diretamente um componente Angular como se ele fosse um componente React, mas é possível criar uma **camada de integração** entre os dois.

| Estratégia | Ideia | Principal atenção |
|---|---|---|
| Iframe | O navegador abre a aplicação Angular como outra página dentro do Host. | Comunicação entre janelas, tamanho, navegação e políticas de segurança. |
| Angular Elements / Web Components | Angular disponibiliza um componente como elemento HTML customizado que o Host pode inserir na página. | Como carregar, registrar e versionar o elemento; eventos, propriedades e ciclo de vida. |
| Module Federation + integração | O Host carrega código remoto e uma camada específica inicializa e remove o Angular em um elemento da página. | Federation carrega o módulo; o wrapper ou adaptador precisa cuidar da montagem, desmontagem e compatibilidade. |
| single-spa | Um orquestrador gerencia aplicações de frameworks diferentes e seus ciclos de vida na mesma página. | Configuração do ciclo de vida, integração e custos de operação. |

Essas alternativas **não estão implementadas neste projeto**. Um Web Component Angular também pode ser distribuído e carregado de formas diferentes; Module Federation é uma possibilidade, não uma exigência.

### Exemplo conceitual: Federation + Web Component

```text
Host React
    │
    ├─ 1. Carrega código remoto que registra o elemento
    │      (por exemplo, usando Federation)
    │
    └─ 2. Insere <notificacoes-angular> na página
                  │
                  ▼
       Angular controla o conteúdo desse elemento
```

Neste cenário não há iframe, mas a equipe ainda precisa definir como inicializar o Angular, passar dados, lidar com eventos, versões e remoção do componente.

---

## 8. Perguntas rápidas para a aula

**“Angular precisa de iframe?”**  
Não. Aqui usamos iframe por escolha de integração.

**“Module Federation é um iframe?”**  
Não. Federation carrega módulos entre builds; iframe incorpora outro documento.

**“O Angular deste projeto usa o mesmo React compartilhado dos outros MFEs?”**  
Não. Ele é uma aplicação Angular em seu próprio contexto de janela. A configuração `shared` dos remotes React não integra automaticamente as dependências do iframe.

**“Um iframe sempre impede qualquer acesso entre aplicações?”**  
Não. O comportamento depende das origens e das políticas aplicáveis. Neste exemplo local as portas diferentes criam origens diferentes; a comunicação explícita usa `postMessage`.

**“Se uma mensagem foi enviada antes de o Angular começar a ouvir, ela é guardada para ele?”**  
Não automaticamente. Neste exemplo, o Host repete o envio enquanto a tela de notificações está montada.

---

## 9. Fechamento: fala de 30 segundos

> “No nosso portal, Cliente e Catálogo são componentes React carregados com Module Federation. Já Notificações é uma aplicação Angular completa que escolhemos abrir em um iframe. Isso dá a ela um documento e um runtime próprios, mas exige uma comunicação explícita, como o `postMessage`. Angular não exige iframe: poderíamos estudar outras integrações, como Web Components ou um adaptador com Federation. A escolha depende do isolamento e dos custos que queremos assumir.”
