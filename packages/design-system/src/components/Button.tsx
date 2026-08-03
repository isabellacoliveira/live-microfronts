import type { ReactNode } from 'react';

// Componente base de botão.
// Responsabilidade: fornecer um controle de ação visualmente consistente.
// Quando usar: ações primárias ou secundárias em qualquer microfrontend.
// Quando não usar: para navegação complexa, onde um link ou menu seria mais apropriado.

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, variant = 'primary', onClick, ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      {...props}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid #4f46e5',
        background: variant === 'primary' ? '#4f46e5' : 'white',
        color: variant === 'primary' ? 'white' : '#111827',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
