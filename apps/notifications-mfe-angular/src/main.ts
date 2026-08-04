import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Notifications MFE Angular.
// Responsabilidade: demonstrar um microfrontend Angular coexistindo com React.
// Este MFE implementa a spec de notifications: lista, badge de contador e preferências.
// Comunicação: sessionStorage + Custom Events (mesmo padrão dos MFEs React) +
// ponte postMessage para quando rodar dentro do iframe do host (porta 5173).

const STORAGE_KEY = 'live-microfronts:shared-state';
const BRIDGE_CHANNEL = 'microfrontends:iframe-bridge';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  unread: boolean;
};

type SharedState = {
  text: string;
  source: string;
  scope?: string;
  updatedAt: string;
};

type Filter = 'all' | 'unread';

function getSharedState(): SharedState {
  if (typeof window === 'undefined') {
    return {
      text: 'Nenhuma mensagem ainda',
      source: 'initial',
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        text: 'Nenhuma mensagem ainda',
        source: 'initial',
        updatedAt: new Date().toISOString(),
      };
    }

    return JSON.parse(raw) as SharedState;
  } catch {
    return {
      text: 'Nenhuma mensagem ainda',
      source: 'initial',
      updatedAt: new Date().toISOString(),
    };
  }
}

function publishMessage(eventName: string, detail: unknown) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

// Envia um evento para o host (quando rodando dentro do iframe do host).
function publishToParent(detail: unknown) {
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
    window.parent.postMessage({ channel: BRIDGE_CHANNEL, payload: detail }, '*');
  }
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-root',
  template: `
    <section style="border: 1px solid #e5e7eb; padding: 1rem; border-radius: 0.75rem; background: white; font-family: sans-serif;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
        <div>
          <h3 style="margin: 0;">Notifications MFE</h3>
          <p style="margin: 0.35rem 0 0; color: #6b7280; font-size: 0.9rem;">
            Angular coexisting with React no mesmo sistema.
          </p>
        </div>
        <span style="display: inline-block; padding: 0.25rem 0.6rem; border-radius: 999px; background: #eef2ff; color: #4338ca; font-size: 0.85rem;">
          {{ unreadCount }} não lida{{ unreadCount === 1 ? '' : 's' }}
        </span>
      </div>

      <!-- Estado compartilhado -->
      <div style="margin-top: 1rem; padding: 0.9rem 1rem; background: #f3f4f6; border-radius: 0.75rem;">
        <p style="margin: 0; font-size: 0.9rem;">
          <strong>Estado compartilhado:</strong> {{ stateText }}
        </p>
        <p style="margin: 0.35rem 0 0; font-size: 0.9rem;">
          <strong>Origem:</strong> {{ sharedSource }}
        </p>
      </div>

      <!-- Ações -->
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap;">
        <button type="button" (click)="syncFromSession()"
          style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #4f46e5; background: white; color: #111827; cursor: pointer;">
          Receber estado atual do Host (Dashboard/Profile)
        </button>
        <button type="button" (click)="markAllAsRead()"
          style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #4f46e5; background: #4f46e5; color: white; cursor: pointer;">
          Marcar todas como lidas (local)
        </button>
        <button type="button" (click)="publishDemo()"
          style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #4f46e5; background: white; color: #111827; cursor: pointer;">
          Enviar notificação de volta ao Host
        </button>
      </div>

      <!-- Filtro -->
      <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
        <button type="button" (click)="setFilter('all')"
          [style.background]="filter === 'all' ? '#4f46e5' : 'white'"
          [style.color]="filter === 'all' ? 'white' : '#111827'"
          style="padding: 0.5rem 0.9rem; border-radius: 0.5rem; border: 1px solid #4f46e5; cursor: pointer;">
          Todas ({{ notifications.length }})
        </button>
        <button type="button" (click)="setFilter('unread')"
          [style.background]="filter === 'unread' ? '#4f46e5' : 'white'"
          [style.color]="filter === 'unread' ? 'white' : '#111827'"
          style="padding: 0.5rem 0.9rem; border-radius: 0.5rem; border: 1px solid #4f46e5; cursor: pointer;">
          Não lidas ({{ unreadCount }})
        </button>
      </div>

      <!-- Lista de notificações -->
      <div style="margin-top: 1rem; display: grid; gap: 0.65rem;">
        <ng-container *ngFor="let item of filteredNotifications">
          <div
            [style.background]="item.unread ? '#eef2ff' : 'white'"
            [style.border]="item.unread ? '1px solid #c7d2fe' : '1px solid #e5e7eb'"
            style="padding: 0.9rem 1rem; border-radius: 0.75rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <strong>{{ item.title }}</strong>
                <span *ngIf="item.unread" style="display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; background: #4f46e5; color: white; font-size: 0.75rem;">
                  nova
                </span>
              </div>
              <p style="margin: 0.35rem 0 0; color: #6b7280; font-size: 0.9rem;">{{ item.message }}</p>
            </div>
            <button type="button" (click)="toggleRead(item)"
              style="flex-shrink: 0; padding: 0.4rem 0.8rem; border-radius: 0.5rem; border: 1px solid #d1d5db; background: white; color: #111827; cursor: pointer; font-size: 0.85rem;">
              {{ item.unread ? 'Marcar lida' : 'Marcar não lida' }}
            </button>
          </div>
        </ng-container>

        <p *ngIf="filteredNotifications.length === 0" style="margin: 0; color: #6b7280; font-size: 0.9rem;">
          Nenhuma notificação {{ filter === 'unread' ? 'não lida' : 'disponível' }}.
        </p>
      </div>
    </section>
  `,
})
class AppComponent implements OnInit {
  notifications: NotificationItem[] = [
    { id: 'n1', title: 'Novo pedido', message: 'O pedido #1024 foi confirmado.', unread: true },
    { id: 'n2', title: 'Usuário novo', message: 'ana.silva@exemplo.com criou uma conta.', unread: true },
    { id: 'n3', title: 'Atualização de sistema', message: 'A versão 2.4.1 foi publicada.', unread: false },
  ];

  filter: Filter = 'all';
  stateText = 'Nenhuma mensagem ainda';
  sharedSource = 'initial';

  get unreadCount(): number {
    return this.notifications.filter((item) => item.unread).length;
  }

  get filteredNotifications(): NotificationItem[] {
    return this.filter === 'unread'
      ? this.notifications.filter((item) => item.unread)
      : this.notifications;
  }

ngOnInit() {
    this.syncFromSession();
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('microfrontends:shared-state', this.handleSharedState as EventListener);
    window.addEventListener('message', this.handleBridgeMessage);
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.handleStorageChange);
    window.removeEventListener('microfrontends:shared-state', this.handleSharedState as EventListener);
    window.removeEventListener('message', this.handleBridgeMessage);
  }

  syncFromSession() {
    const state = getSharedState();
    this.stateText = state.text;
    this.sharedSource = state.source;
  }

  setFilter(nextFilter: Filter) {
    this.filter = nextFilter;
  }

  toggleRead(item: NotificationItem) {
    item.unread = !item.unread;
    this.publishCount();
  }

  markAllAsRead() {
    this.notifications.forEach((item) => {
      item.unread = false;
    });
    this.publishCount();
  }

publishDemo() {
    const detail = { text: 'Angular notificou via CustomEvent', source: 'angular' };
    publishMessage('microfrontends:message', detail);
    publishToParent(detail);
  }

  private publishCount() {
    const unread = this.unreadCount;
    const detail = {
      text: `Angular: ${unread} notificação${unread === 1 ? '' : 'ões'} não lida${unread === 1 ? '' : 's'}`,
      source: 'angular',
    };
    publishMessage('microfrontends:message', detail);
    publishToParent(detail);
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      this.syncFromSession();
    }
  };

  private handleSharedState = () => {
    this.syncFromSession();
  };

  private handleBridgeMessage = (event: MessageEvent) => {
    const data = event.data as { channel?: string; payload?: SharedState } | null;
    if (data && data.channel === BRIDGE_CHANNEL && data.payload) {
      this.stateText = data.payload.text || this.stateText;
      this.sharedSource = data.payload.source || this.sharedSource;
    }
  };
}

bootstrapApplication(AppComponent);

