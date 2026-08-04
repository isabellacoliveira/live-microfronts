// Utilitários de comunicação para a palestra.
// Responsabilidade: demonstrar diferentes mecanismos de comunicação entre MFEs.
// Quando usar: para mostrar trade-offs entre eventos, pub/sub e armazenamento compartilhado.

const STORAGE_KEY = 'live-microfronts:shared-state';

type SharedState = {
  text: string;
  source: string;
  scope?: string;
  updatedAt: string;
};

export function getSharedState(): SharedState {
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
  publishMessage('microfrontends:shared-state', nextState);

  return nextState;
}

export function publishMessage(eventName: string, detail: unknown) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function subscribeMessage(eventName: string, handler: (event: Event) => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}

export function readSharedStateFromStorage() {
  if (typeof window === 'undefined') {
    return getSharedState();
  }

  return getSharedState();
}
