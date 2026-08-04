import { useEffect, useState } from 'react';
import { Button, Card } from '@design-system';
import { getSharedState, publishMessage, setSharedState, subscribeMessage } from '@shared-utils';

// Dashboard MFE React.
// Responsabilidade: demonstrar um microfrontend visual com um bloco de métricas.
// O objetivo didático é mostrar que este app pode evoluir independentemente do host.
// Este componente é exposto via Module Federation para o host carregar em runtime.

export default function DashboardApp() {
  const [sharedState, setSharedStateValue] = useState(() => getSharedState());

  useEffect(() => {
    const unsubscribe = subscribeMessage('microfrontends:shared-state', (event: Event) => {
      const detail = (event as CustomEvent<{ text: string; source: string }>).detail;
      setSharedStateValue(detail ?? getSharedState());
    });

    return unsubscribe;
  }, []);

  const handleUpdate = () => {
    const nextState = setSharedState({ text: 'Dashboard MFE atualizou o estado', source: 'dashboard', scope: 'dashboard' });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: 'Dashboard atualizou o estado' });
  };

  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <h2>Dashboard MFE</h2>
      <Card>
        <h3>Indicadores</h3>
        <p>Vendas: 42</p>
        <p>Usuários ativos: 180</p>
        <p>Estado compartilhado: {sharedState.text}</p>
        <Button onClick={handleUpdate}>Atualizar estado</Button>
      </Card>
    </div>
  );
}

