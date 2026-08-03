// Utilitários de comunicação para a palestra.
// Responsabilidade: demonstrar diferentes mecanismos de comunicação entre MFEs.
// Quando usar: para mostrar trade-offs entre eventos, pub/sub e armazenamento compartilhado.

export function publishMessage(eventName: string, detail: unknown) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function subscribeMessage(eventName: string, handler: (event: Event) => void) {
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}
