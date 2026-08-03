import React from 'react';
import ReactDOM from 'react-dom/client';
import { Card, Button, Input } from '@design-system';

// Profile MFE React.
// Responsabilidade: demonstrar um microfrontend de perfil com formulário simples.
// O objetivo didático é mostrar que este bloco pode evoluir independentemente do host.

function ProfileApp() {
  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <h2>Profile MFE</h2>
      <Card>
        <h3>Dados do usuário</h3>
        <Input placeholder="Nome" />
        <Input placeholder="Email" />
        <Button>Salvar</Button>
      </Card>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProfileApp />
  </React.StrictMode>
);
