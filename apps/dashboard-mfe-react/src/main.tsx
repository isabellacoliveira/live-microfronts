import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Card } from '@design-system';

// Dashboard MFE React.
// Responsabilidade: demonstrar um microfrontend visual com um bloco de métricas.
// O objetivo didático é mostrar que este app pode evoluir independentemente do host.

function DashboardApp() {
  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <h2>Dashboard MFE</h2>
      <Card>
        <h3>Indicadores</h3>
        <p>Vendas: 42</p>
        <p>Usuários ativos: 180</p>
        <Button>Ver detalhes</Button>
      </Card>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>
);
