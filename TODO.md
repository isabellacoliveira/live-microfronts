# TODO - Complementar o MFE Angular com componentes de notificações

## Objetivo
Evoluir o `notifications-mfe-angular` de placeholder para um MFE de notificações completo, conforme a spec arquitetural (§8): lista de notificações, badge de contador e configurações de preferências.

## Plano

### 1. Evoluir o componente principal
- [x] 1.1. Reescrever `apps/notifications-mfe-angular/src/main.ts` com:
  - Lista de notificações (`NotificationItem[]`) com `unread`
  - Badge de contador de não lidas
  - Filtro (todas / não lidas)
  - Marcação de lida/não lida
  - Estado compartilhado via sessionStorage + Custom Events
  - Estilo consistente com o design system

## Validação
- [x] `corepack pnpm --filter notifications-mfe-angular lint` passa
- [x] `corepack pnpm --filter notifications-mfe-angular build` passa
- [ ] Host renderiza o MFE via iframe (porta 5003)
