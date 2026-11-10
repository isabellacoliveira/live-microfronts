# Guia para executar os MFEs

Este guia cobre o fluxo recomendado para abrir o Host, carregar os MFEs React por Module Federation e servir o MFE Angular de notificações em um iframe. Use o modo `preview`: ele serve os arquivos de build e disponibiliza os `remoteEntry.js` nos caminhos esperados pelo Host.

## 1. Instalar dependências e gerar os builds

Na raiz do repositório, execute:

```bash
corepack pnpm install
corepack pnpm --filter dashboard-mfe-react build
corepack pnpm --filter profile-mfe-react build
corepack pnpm --filter notifications-mfe-angular build
corepack pnpm --filter host-react build
```

O Host e os MFEs precisam estar buildados antes de iniciar os previews.

## 2. Iniciar os previews

Abra quatro terminais, todos na raiz do repositório, e deixe cada processo rodando:

**Terminal 1 — Catálogo de seguros (porta 5001):**

```bash
corepack pnpm --filter dashboard-mfe-react preview
```

**Terminal 2 — Cliente (porta 5002):**

```bash
corepack pnpm --filter profile-mfe-react preview
```

**Terminal 3 — Host (porta 5173):**

```bash
corepack pnpm --filter host-react preview
```

**Terminal 4 — Notificações Angular (porta 5003):**

```bash
corepack pnpm --filter notifications-mfe-angular preview
```

O Host incorpora esse MFE em um iframe na rota **Notificações**. Ele não usa Module Federation nem `remoteEntry.js`; serve a aplicação Angular pela raiz (`http://127.0.0.1:5003/`). Para testar somente o catálogo ou o perfil React, o Angular não é necessário.

## 3. Conferir se estão disponíveis

Abra o Host em <http://127.0.0.1:5173/> e selecione **Catálogo de seguros**. O catálogo deve aparecer sem a mensagem “O MFE Insurance Catalog não está disponível.” Para testar o Angular, selecione **Notificações**; a página Angular deve aparecer dentro do iframe.

Para verificar as entradas federadas pelo terminal, execute:

```bash
curl -sS -o /dev/null -w 'Dashboard remoteEntry: HTTP %{http_code}\n' \
  http://127.0.0.1:5001/assets/remoteEntry.js
curl -sS -o /dev/null -w 'Profile remoteEntry: HTTP %{http_code}\n' \
  http://127.0.0.1:5002/assets/remoteEntry.js
curl -sS -o /dev/null -w 'Notifications Angular: HTTP %{http_code}\n' \
  http://127.0.0.1:5003/
```

As três respostas devem ser `HTTP 200`. Em modo preview, o Host procura os arquivos federados React em `/assets/remoteEntry.js`; as portas 5001 e 5002 servirem a página inicial, por si só, não confirma que a federação está disponível. Para Angular, o `HTTP 200` da raiz confirma que o servidor está respondendo, mas também confira se o iframe carrega a aplicação no navegador.

## 4. Entender a mensagem de indisponibilidade

O Host importa o catálogo como `dashboard_mfe/App` e o perfil como `profile_mfe/App`. As URLs e os caminhos dos `remoteEntry.js` são definidos na configuração do Host. Se o carregamento falhar, o Host exibe uma mensagem de fallback em vez de derrubar a aplicação inteira.

Um processo pode estar ativo e ainda assim não servir o módulo remoto esperado. Isso acontece, por exemplo, se:

- o MFE estiver em um modo de execução diferente do esperado pelo Host;
- o `remoteEntry.js` não existir no caminho consultado;
- a porta já estiver ocupada por outro processo ou por uma versão antiga do MFE;
- o build não tiver sido atualizado depois de uma alteração.

## 5. Se o Host continuar exibindo o fallback

1. Confira se os quatro previews continuam rodando e se cada um iniciou na porta correta.
2. Repita os comandos `curl` acima. Se algum não retornar `HTTP 200`, confira o log do respectivo terminal e gere novamente o build desse MFE.
3. No navegador, abra as ferramentas de desenvolvedor e veja **Network** e **Console**. Procure falhas ao carregar `remoteEntry.js` ou os arquivos JavaScript do catálogo.
4. Se houver processos antigos nas portas, identifique-os antes de encerrar:

   ```bash
   lsof -nP -iTCP:5001 -sTCP:LISTEN
   lsof -nP -iTCP:5002 -sTCP:LISTEN
   lsof -nP -iTCP:5003 -sTCP:LISTEN
   lsof -nP -iTCP:5173 -sTCP:LISTEN
   ```

   Encerre somente os processos que você confirmou serem os previews antigos, usando `kill <PID>`, e inicie novamente os previews necessários. Se os processos estiverem em primeiro plano nos terminais, `Ctrl+C` os encerra.

5. Se os remotes foram reconstruídos, reconstrua também o Host e reinicie os previews para garantir que todos estejam servindo os builds atuais.
