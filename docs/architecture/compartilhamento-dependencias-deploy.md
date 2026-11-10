# Compartilhamento de dependências e deploy de microfrontends

Este material complementa a demonstração prática. Ele responde a três perguntas:

1. Por que existe uma pasta `packages` neste projeto?
2. O que poderíamos fazer se ela não existisse?
3. Como o código compartilhado chega à aplicação em produção?

## Resposta curta

**A pasta `packages` é uma forma de organizar código compartilhado, não uma exigência de microfrontends ou de Module Federation.**

Neste projeto, Host e MFEs conseguem acessar essa pasta porque estão no mesmo repositório. Durante o build, o Vite encontra os arquivos usados e os inclui nos artefatos das aplicações, conforme a configuração de cada build. O navegador recebe os artefatos publicados; ele não precisa acessar a pasta `packages` do repositório.

Se as aplicações estivessem em repositórios diferentes, elas poderiam consumir uma biblioteca publicada em um registro de pacotes, como um registry privado. Essa biblioteca pode morar em um repositório próprio **ou** no monorepo; um repositório separado não é obrigatório.

> **Cuidado com a palavra “compartilhar”:** compartilhar código-fonte, compartilhar uma dependência em runtime e trocar dados entre aplicações são três coisas diferentes.

---

## 1. O que existe neste projeto?

### O mapa do repositório

```text
live-microfronts/                   ← um repositório (monorepo)
│
├── apps/
│   ├── host-react/                 ← compõe a experiência
│   ├── dashboard-mfe-react/        ← catálogo de seguros
│   ├── profile-mfe-react/          ← cadastro de cliente
│   └── notifications-mfe-angular/ ← notificações, em iframe
│
└── packages/
    ├── design-system/              ← Button, Input, Card...
    ├── shared-utils/               ← eventos e estado compartilhado
    └── shared-types/               ← tipos compartilhados
```

`packages` está **fora das pastas de cada app**, mas está **dentro do mesmo repositório**. Portanto, durante o desenvolvimento e o build, o Host e os MFEs podem acessar os arquivos dessa pasta.

### Exemplo: o botão do catálogo

Abra:

1. [InsuranceCatalog.tsx](../../apps/dashboard-mfe-react/src/features/contract-insurance/ui/InsuranceCatalog.tsx)
2. [Button.tsx](../../packages/design-system/src/components/Button.tsx)
3. [vite.config.ts do Catálogo](../../apps/dashboard-mfe-react/vite.config.ts)

No catálogo:

```tsx
import { Badge, Button, Card } from '@design-system';
```

Na configuração Vite do catálogo:

```ts
alias: {
  '@design-system': fileURLToPath(
    new URL('../../packages/design-system/src', import.meta.url),
  ),
}
```

Leia assim:

> “Quando o Catálogo importar `@design-system`, procure o código na pasta `packages/design-system/src` deste repositório.”

Esse nome é um **alias**, ou seja, um apelido para um caminho. O Host e o Cliente também possuem seus próprios aliases nas configurações Vite.

**Importante:** no projeto atual, o import `@design-system` é resolvido pelo alias, não por uma biblioteca baixada de um registry. O [package.json do design system](../../packages/design-system/package.json) está marcado como `private` e seu script de build é apenas um placeholder; publicá-lo como biblioteca exigiria preparação adicional.

---

## 2. Como esse código vai para produção?

Pense no **build** como a preparação de uma mala para cada aplicação:

```text
REPOSITÓRIO, no ambiente de build
┌──────────────────────────────────────────┐
│ apps/host-react        ─┐                │
│ apps/dashboard-mfe-react ├─→ packages/  │
│ apps/profile-mfe-react ─┘                │
└──────────────────────────────────────────┘
                     │
                     │ cada aplicação executa seu próprio build
                     ▼
ARTEFATOS GERADOS
┌─────────────────┐   ┌─────────────────────┐
│ dist/ do Host   │   │ dist/ do Catálogo   │
│ HTML + arquivos │   │ remoteEntry +       │
│ JS/CSS gerados  │   │ arquivos JS/CSS     │
└─────────────────┘   └─────────────────────┘
         │                      │
         ▼                      ▼
 servidor do Host       servidor do Catálogo
```

O Vite resolve os imports necessários e transforma o código das aplicações e das bibliotecas utilizadas em arquivos de saída. Dependendo da configuração, esse código pode ser incorporado, separado em chunks ou tratado de outra maneira. **Estar em `packages` não significa que o navegador buscará o arquivo original nessa pasta.**

Quando a usuária acessa a aplicação:

```text
1. Navegador ──→ servidor do Host ──→ arquivos do Host
2. Usuária abre o Catálogo
3. Navegador ──→ servidor do Catálogo ──→ remoteEntry.js e chunks do Catálogo
4. O código necessário ao Catálogo é executado no navegador
```

O código do design system usado pelo Catálogo acompanha os artefatos gerados para ele, conforme o build. Isso **não garante uma única cópia** do botão no navegador: Host e Catálogo podem incluir código do mesmo design system em seus próprios builds.

### O que precisa estar disponível em cada momento?

| Momento | Quem precisa acessar `packages`? | Por quê? |
|---|---|---|
| Desenvolvimento | A ferramenta que executa ou constrói o projeto | Os aliases apontam para arquivos locais. |
| Build no CI | O job de build que usa esse código | Ele precisa encontrar os arquivos antes de gerar o `dist`. |
| Navegador em produção | Não precisa acessar a pasta original | Ele baixa os artefatos publicados dos servidores. |

**Exemplo importante:** se o job de build copiar apenas `apps/dashboard-mfe-react`, o caminho `../../packages/design-system/src` pode deixar de existir e o build falhar. No modelo atual, o job precisa ter acesso também aos arquivos compartilhados e às demais dependências necessárias.

> Este repositório é uma demonstração local. Ele tem configurações e scripts de build, mas os endereços dos remotes no Host estão fixos em `127.0.0.1`. Para um deploy real, seria necessário configurar URLs públicas adequadas ao ambiente, publicar os artefatos e verificar compatibilidade, CORS e cache. O diagrama acima é um exemplo de arquitetura de deploy, não um pipeline já implementado.

---

## 3. E se não existisse a pasta `packages`?

Não é preciso ter uma pasta chamada `packages` para compartilhar dependências. Existem alternativas:

### Opção A — Cada app mantém seu próprio código

```text
apps/
├── host/      → seu próprio Button
├── cliente/   → seu próprio Button
└── catalogo/  → seu próprio Button
```

**Como funciona:** cada aplicação implementa suas peças ou instala suas próprias dependências.

**Vantagem:** simples para começar; cada app evolui sem esperar uma biblioteca comum.

**Custo:** pode haver repetição, divergência visual e mais trabalho para corrigir o mesmo problema em vários lugares.

> Não é errado duplicar um pouco de código. Se uma regra não é realmente comum, forçar o compartilhamento também pode aumentar o acoplamento.

### Opção B — Usar uma biblioteca publicada em um registry

```text
Código do design system
       │
       │ build e publicação de uma versão, por exemplo 1.2.0
       ▼
Registro de pacotes (registry)
       │
       ├── Host instala a versão 1.2.0
       ├── Cliente instala a versão 1.2.0
       └── Catálogo instala a versão 1.2.0
```

Um **registry** é um lugar onde pacotes versionados são disponibilizados para instalação. Pode ser público ou privado; empresas geralmente escolhem acesso privado para bibliotecas internas.

Cada aplicação pode declarar a biblioteca em seu `package.json`. Por exemplo, em uma solução hipotética:

```json
{
  "dependencies": {
    "@empresa/design-system": "1.2.0"
  }
}
```

O aplicativo importaria `Button` do nome público do pacote. Na instalação, a ferramenta de pacotes baixa a versão declarada; no build, ela é processada com a aplicação. **Exemplo ilustrativo:** `@empresa/design-system` não é um pacote publicado por este projeto.

**Vantagens:** funciona entre repositórios; cada MFE pode escolher quando atualizar.

**Custos:** é necessário publicar, controlar versões, definir permissões e manter compatibilidade. Se o time publicar `1.3.0`, um app que depende de `1.2.0` não muda sozinho: precisa atualizar sua dependência e fazer novo build/deploy.

Para fazer isso com o design system deste projeto, seria preciso prepará-lo para distribuição: definir entradas e formatos de saída, gerar os arquivos distribuíveis, ajustar dependências e publicação, e configurar o registry. A configuração atual é voltada ao acesso ao código-fonte pelo monorepo.

### Opção C — Outros mecanismos

É possível disponibilizar bibliotecas por um repositório Git, por artefatos de CI ou expor um módulo em runtime, por exemplo usando Federation. Cada escolha exige cuidar de versionamento, disponibilidade e compatibilidade. **Não são a mesma configuração que o alias atual.**

---

## 4. Precisa ter um repositório separado?

**Não. Um repositório é o lugar onde o código é mantido; um registry é o lugar de onde uma versão de pacote pode ser instalada.**

### Modelo 1: tudo no monorepo

```text
UM REPOSITÓRIO
├── Host
├── Cliente
├── Catálogo
└── Design system

CI acessa esse repositório → constrói cada aplicação → publica cada artefato
```

É a organização deste projeto. Os builds podem ser executados separadamente. **Isso, por si só, não prova deploy independente:** é preciso configurar e operar os pipelines e a publicação para isso.

### Modelo 2: repositórios separados e pacote publicado

```text
REPOSITÓRIO A             REPOSITÓRIO B             REPOSITÓRIO C
Design system             Host                      Catálogo
     │                      │                           │
     ▼                      │                           │
Registry: versão 1.2.0 ◄────┴── instala no build ──────┘
                              │                    │
                              ▼                    ▼
                         deploy Host        deploy Catálogo
```

O design system pode ter um repositório próprio, mas não precisa: ele também poderia ser mantido em um monorepo e publicado no mesmo registry para outras aplicações consumirem.

### Modelo 3: repositórios separados, sem biblioteca comum

Cada aplicação implementa ou instala suas próprias dependências. A autonomia aumenta em algumas decisões, mas a consistência e a manutenção compartilhada exigem outros acordos.

**Fala para a aula**

> “Estar em um monorepo é uma escolha de organização do código. Ter um pacote publicado é uma escolha de distribuição. Deploy independente é uma escolha de pipeline e operação. Uma coisa não obriga a outra.”

---

## 5. Alias, biblioteca instalada e Federation `shared` são iguais?

**Não.** Os nomes são parecidos porque todos ajudam a reutilizar algo, mas atuam em momentos diferentes.

| Mecanismo | Pergunta que responde | Exemplo | Quando acontece |
|---|---|---|---|
| Alias | “Onde está o código indicado por este nome?” | `@design-system` aponta para uma pasta local. | Resolução de imports pelo Vite, inclusive no build. |
| Pacote instalado | “De onde vem e qual versão da biblioteca esta app usa?” | Um app instala `@empresa/design-system@1.2.0` de um registry. | Instalação de dependências e build. |
| Federation `shared` | “Quais dependências são declaradas para compartilhamento entre builds federados?” | Host e remotes React declaram `react` e `react-dom`. | Configuração de build e resolução pelo runtime de Federation. |
| Evento / estado | “Como as telas trocam dados?” | `customer.updated` e `sessionStorage` neste projeto. | Durante o uso da aplicação no navegador. |

### E o React?

No [Vite do Host](../../apps/host-react/vite.config.ts) e no [Vite do Catálogo](../../apps/dashboard-mfe-react/vite.config.ts), existe:

```ts
shared: ['react', 'react-dom']
```

Isso declara essas dependências para o mecanismo de compartilhamento do plugin de Federation. A intenção é facilitar o uso de dependências compatíveis entre o Host e os remotes React. **Não significa que o código desaparece do build, nem garante automaticamente uma única instância de React em todos os cenários.** O comportamento depende do plugin, das versões e da configuração; é preciso testar.

O `@design-system` **não está nessa lista** neste projeto. Ele é reutilizado por alias no monorepo. Uma equipe poderia estudar outra estratégia para a biblioteca, mas ela exigiria configuração e validação próprias.

### E o Angular?

O Angular deste projeto é carregado em um **iframe**, como uma página separada. Ele possui seu próprio contexto de janela e suas dependências. O `shared` configurado entre o Host e os remotes React não faz o Angular do iframe usar automaticamente o mesmo runtime ou as mesmas bibliotecas.

---

## 6. Exemplo de deploy independente: o que acontece numa mudança?

Suponha que o time altere o visual do `Button` do design system:

### No modelo atual: código no monorepo

```text
1. Altera packages/design-system/src/components/Button.tsx
2. Executa os builds das aplicações que precisam receber a mudança
3. Publica os artefatos atualizados dessas aplicações
```

Alterar o arquivo no repositório **não muda automaticamente** os builds já publicados. Se somente o Host for reconstruído e publicado, o Catálogo publicado anteriormente pode continuar com o visual antigo.

### No modelo com pacote versionado

```text
1. Altera e publica o design system, por exemplo 1.3.0
2. Cada aplicação atualiza sua dependência quando decidir adotá-la
3. Cada aplicação é reconstruída e publicada
```

Isso dá controle sobre a atualização, mas exige manter versões compatíveis enquanto aplicações diferentes não migram.

### Atenção ao Remote

O Host precisa conhecer um endereço de `remoteEntry.js` acessível pelo navegador. Ao atualizar o Catálogo, publique o `remoteEntry.js` **e todos os chunks aos quais ele se refere** de modo consistente. Tenha uma estratégia de cache e, quando necessário, mantenha chunks antigos disponíveis durante a transição para não quebrar usuários com arquivos em cache. Também é importante testar o contrato exposto antes de publicar.

---

## 7. Uma diferença importante: código compartilhado não é dado compartilhado

No fluxo de Cliente e Catálogo, há duas ideias diferentes ao mesmo tempo:

```text
CÓDIGO:
Cliente e Catálogo usam helpers de packages/shared-utils
              ↓
cada build tem acesso à implementação necessária

DADOS:
Cliente salva dados no sessionStorage e publica customer.updated
              ↓
Catálogo pode ler o estado salvo ou reagir ao evento enquanto estiver ouvindo
```

`packages/shared-utils` fornece funções; **a pasta não é um banco de dados e não transporta dados entre servidores**. Neste exemplo, os remotes React executam na página do Host, usam o `window` dessa página e o `sessionStorage` da origem do Host. Eventos não são reproduzidos para um componente que ainda não estava escutando; é por isso que o Catálogo também consulta o estado salvo ao abrir.

Em aplicações hospedadas em contextos ou origens diferentes, não presuma que `sessionStorage` e eventos de janela serão compartilhados. Um iframe tem outra janela; neste projeto, o Host envia contratos ao Angular usando `postMessage`. Em produção, valide a origem e o conteúdo das mensagens.

## 8. Fala curta para encerrar

> “A pasta `packages` é uma conveniência deste monorepo: ela guarda código que vários apps podem usar. No build, esse código é processado para gerar os arquivos de cada aplicação; o navegador não precisa abrir a pasta do repositório. Em vários repositórios, podemos publicar uma biblioteca versionada em um registry. Já `shared` é outra coisa: é a configuração de dependências do Module Federation. Nenhuma dessas escolhas, sozinha, garante deploy independente ou uma única cópia da dependência.”
