// Componente base de input.
// Responsabilidade: padronizar a entrada de texto visualmente.

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        width: '100%',
      }}
    />
  );
}
