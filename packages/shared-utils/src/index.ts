// Utilidades compartilhadas.
// Responsabilidade: fornecer helpers reutilizáveis com foco em domínio e comunicação.

export function formatCount(value: number) {
  return `${value}`;
}

export function buildMessage(title: string, detail: string) {
  return `${title}: ${detail}`;
}

export * from './communication';
