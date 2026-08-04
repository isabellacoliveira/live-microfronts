import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

const STORAGE_KEY = 'live-microfronts:shared-state';
const BRIDGE_CHANNEL = 'microfrontends:iframe-bridge';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  unread: boolean;
  date: string;
};

type InsuranceContract = {
  id: string;
  customer: { name: string };
  insurance: { name: string; price: number };
  contractDate: string;
};

type SharedState = {
  text: string;
  source: string;
  scope?: string;
  updatedAt: string;
};

type BridgePayload = Partial<SharedState> & {
  insuranceContracts?: InsuranceContract[];
};

type Filter = 'all' | 'unread';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-root',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: NotificationItem[] = [
    {
      id: 'welcome',
      title: 'Central de notificações',
      message: 'Acompanhe as contratações de seguros em tempo real.',
      unread: false,
      date: new Date().toISOString(),
    },
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
    const state = this.getSharedState();
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
    this.publishMessage('microfrontends:message', detail);
    this.publishToParent(detail);
  }

  private getSharedState(): SharedState {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as SharedState;
      }
    } catch {
      // O MFE continua utilizável mesmo que o sessionStorage esteja indisponível.
    }

    return {
      text: 'Nenhuma mensagem ainda',
      source: 'initial',
      updatedAt: new Date().toISOString(),
    };
  }

  private publishMessage(eventName: string, detail: unknown) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  private publishToParent(detail: unknown) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ channel: BRIDGE_CHANNEL, payload: detail }, '*');
    }
  }

  private publishCount() {
    const unread = this.unreadCount;
    const detail = {
      text: `Angular: ${unread} notificação${unread === 1 ? '' : 'ões'} não lida${unread === 1 ? '' : 's'}`,
      source: 'angular',
    };
    this.publishMessage('microfrontends:message', detail);
    this.publishToParent(detail);
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
    const data = event.data as { channel?: string; payload?: BridgePayload } | null;
    if (!data || data.channel !== BRIDGE_CHANNEL || !data.payload) {
      return;
    }

    this.stateText = data.payload.text || this.stateText;
    this.sharedSource = data.payload.source || this.sharedSource;

    const knownIds = new Set(this.notifications.map((item) => item.id));
    const newNotifications = (data.payload.insuranceContracts || [])
      .filter((contract) => !knownIds.has(`insurance-${contract.id}`))
      .map((contract): NotificationItem => ({
        id: `insurance-${contract.id}`,
        title: 'Seguro contratado com sucesso',
        message: `${contract.customer.name} contratou ${contract.insurance.name}.`,
        unread: true,
        date: contract.contractDate,
      }));

    if (newNotifications.length > 0) {
      this.notifications = [...newNotifications, ...this.notifications].slice(0, 50);
      this.publishCount();
    }
  };
}
