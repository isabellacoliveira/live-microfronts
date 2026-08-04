# TODO — Comunicação dinâmica entre MFEs + ponte postMessage para Angular

## Objetivo
Tornar a demonstração de microfrontends realmente dinâmica e visível na live:
- Dashboard, Profile e Angular (iframe) conversando em tempo real de forma clara.
- Activity Feed no host mostrando cada evento de comunicação.
- Ponte postMessage para incluir o Angular (iframe) na comunicação em tempo real.
- Documentar por que o Angular sozinho não exibia tela.

## Plano de implementação

### 1. Melhorar o `shared-utils` (barramento de comunicação enriquecido)
- [ ] Estender `communication.ts` para suportar um histórico de eventos (activity log) com timestamp.
- [ ] Adicionar utilitário de histórico de eventos (append + subscribe).
- [ ] Adicionar helper `postMessageToIframe` e `postMessageFromParent` para ponte with iframe.

### 2. Host — Activity Feed em tempo real
- [ ] Adicionar painel "Activity Feed" que lista cada evento de comunicação (quem enviou, hora, tipo).
- [ ] Conectar o feed ao subscribe de `microfrontends:message` e `microfrontends:shared-state`.
- [ ] Implementar ponte postMessage para o iframe Angular (enviar eventos para o iframe e receber dele).

### 3. Dashboard MFE — interações dinâmicas
- [ ] Adicionar métrica/contador que muda e propaga para todos.
- [ ] Mostrar log local de eventos recebidos.

### 4. Profile MFE — interações dinâmicas
- [ ] Editar nome/email que aparece ao vivo no dashboard e no feed.
- [ ] Mostrar log local de eventos recebidos.

### 5. Angular MFE — ponte postMessage
- [ ] Adicionar listener de `message` (postMessage) para receber eventos do host.
- [ ] Enviar eventos via `parent.postMessage` para o host.
- [ ] Manter a lógica de notificações funcionando.

### 6. Documentação
- [ ] Criar/atualizar `docs/architecture/angular-iframe-why.md` explicando por que o Angular não exibia tela sozinho (dependências incompatíveis + processo preso na porta).
- [ ] Atualizar README se necessário.

### 7. Verificação final
- [ ] Build de todos os apps.
- [ ] Testar todos os endpoints (5173, 5001, 5002, 5003).
- [ ] Confirmar que o Angular funciona sozinho e dentro do iframe do host.
