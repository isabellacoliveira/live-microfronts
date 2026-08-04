// Utilitários de comunicação para a palestra.
// Responsabilidade: demonstrar diferentes mecanismos de comunicação entre MFEs.
// Quando usar: para mostrar trade-offs entre eventos, pub/sub e armazenamento compartilhado.

const STORAGE_KEY = 'live-microfronts:shared-state';
const ACTIVITY_KEY = 'live-microfronts:activity-feed';

const EVENT_MESSAGE = 'microfrontends:message';
const EVENT_STATE = 'microfrontends:shared-state';
const EVENT_IFRAME_BRIDGE = 'microfrontends:iframe-bridge';

export const INSURANCE_EVENTS = {
  customerUpdated: 'customer.updated',
  insuranceContracted: 'insurance.contracted',
} as const;

export type Customer = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
};

export type Insurance = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type InsuranceContract = {
  id: string;
  customer: Customer;
  insurance: Insurance;
  contractDate: string;
  status: 'Ativa';
};

type SharedState = {
  text: string;
  source: string;
  scope?: string;
  counter?: number;
  customer?: Customer;
  insuranceContract?: InsuranceContract;
  updatedAt: string;
};

export type ActivityEvent = {
  id: string;
  timestamp: string;
  source: string;
  type: 'message' | 'state' | 'bridge' | 'event';
  label: string;
  detail?: unknown;
};

// ---------------------------- shared state ----------------------------

function defaultState(): SharedState {
  return {
    text: 'Nenhuma mensagem ainda',
    source: 'initial',
    counter: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function getSharedState(): SharedState {
  if (typeof window === 'undefined') {
    return defaultState();
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }

    return { ...defaultState(), ...(JSON.parse(raw) as SharedState) };
  } catch {
    return defaultState();
  }
}

export function setSharedState(partial: Partial<SharedState>): SharedState {
  if (typeof window === 'undefined') {
    return getSharedState();
  }

  const nextState: SharedState = {
    ...getSharedState(),
    ...partial,
    updatedAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  publishMessage(EVENT_STATE, nextState);

  return nextState;
}

// ---------------------------- activity feed ----------------------------

export function getActivityFeed(): ActivityEvent[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(ACTIVITY_KEY);
    return raw ? (JSON.parse(raw) as ActivityEvent[]) : [];
  } catch {
    return [];
  }
}

export function appendActivity(feedEvent: Omit<ActivityEvent, 'id' | 'timestamp'>): ActivityEvent {
  const entry: ActivityEvent = {
    ...feedEvent,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const current = getActivityFeed();
    const next = [entry, ...current].slice(0, 50);
    window.sessionStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
    publishMessage('microfrontends:activity', entry);
  }

  return entry;
}

// ---------------------------- pub/sub ----------------------------

export function publishMessage(eventName: string, detail: unknown) {
  if (typeof window === 'undefined') {
    return;
  }

  // Guarda contra recursão infinita: o evento de activity já é disparado pelo
  // próprio appendActivity, então não devemos chamar appendActivity de novo aqui.
  if (eventName === 'microfrontends:activity') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    return;
  }

  const source =
    detail && typeof detail === 'object' && (detail as { source?: string }).source
      ? String((detail as { source?: string }).source)
      : 'host';

  appendActivity({
    source,
    type:
      eventName.indexOf('state') !== -1
        ? 'state'
        : eventName.indexOf('activity') !== -1
          ? 'event'
          : 'message',
    label: eventName,
    detail,
  });

  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function subscribeMessage(eventName: string, handler: (event: Event) => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}

// API curta usada pelos MFEs de negócio. Mantém os produtores e consumidores
// desacoplados: nenhum MFE importa o código de outro MFE.
export function publish<T>(eventName: string, payload: T) {
  publishMessage(eventName, payload);
}

export function subscribe<T>(eventName: string, handler: (payload: T) => void) {
  return subscribeMessage(eventName, (event) => {
    handler((event as CustomEvent<T>).detail);
  });
}

// ---------------------------- iframe bridge (postMessage) ----------------------------

export function postMessageToIframe(iframeWindow: Window | null, detail: unknown, targetOrigin = '*') {
  if (!iframeWindow) {
    return;
  }

  iframeWindow.postMessage({ channel: EVENT_IFRAME_BRIDGE, payload: detail }, targetOrigin);
}

export function subscribeIframeBridge(handler: (payload: unknown) => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const onMessage = (event: MessageEvent) => {
    if (
      event.data &&
      typeof event.data === 'object' &&
      (event.data as { channel?: string }).channel === EVENT_IFRAME_BRIDGE
    ) {
      handler((event.data as { payload: unknown }).payload);
    }
  };

  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}

// ---------------------------- helpers ----------------------------

export function readSharedStateFromStorage() {
  return getSharedState();
}

export { EVENT_MESSAGE, EVENT_STATE, EVENT_IFRAME_BRIDGE, STORAGE_KEY };
