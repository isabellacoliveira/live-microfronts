import type { ReactNode } from 'react';

// Componente de badge.
// Responsabilidade: destacar estado, contador ou categoria.

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.6rem',
        borderRadius: '999px',
        background: '#eef2ff',
        color: '#4338ca',
        fontSize: '0.85rem',
      }}
    >
      {children}
    </span>
  );
}
