import type { ReactNode } from 'react';

// Componente base de card.
// Responsabilidade: encapsular conteúdo visual em uma caixa reutilizável.

export function Card({ children }: { children: ReactNode }) {
  return (
    <section
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        padding: '1rem',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </section>
  );
}
