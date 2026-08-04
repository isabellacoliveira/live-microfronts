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
      const detail = (event as CustomEvent<{ text: string; source: string; scope?: string }>).detail;
      setSharedStateValue(detail ? { ...getSharedState(), ...detail } : getSharedState());
    });

    return unsubscribe;
  }, []);

  const handleUpdate = () => {
    const nextState = setSharedState({ text: 'Dashboard MFE atualizou o estado', source: 'dashboard', scope: 'dashboard' });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: 'Dashboard atualizou o estado' });
  };

  const handleSyncFromSession = () => {
    const nextState = getSharedState();
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: `Sincronizado: ${nextState.text}` });
  };

  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', padding: '1.25rem', borderRadius: '1rem' }}>
        <h2 style={{ margin: 0 }}>Dashboard MFE</h2>
        <p style={{ margin: '0.35rem 0 0' }}>Este MFE recebe o estado do host e pode enviá-lo de volta.</p>
      </div>
      <Card>
        <h3>Indicadores</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <p style={{ margin: 0 }}>Vendas: 42</p>
          <p style={{ margin: 0 }}>Usuários ativos: 180</p>
          <p style={{ margin: 0 }}><strong>Último estado recebido:</strong> {sharedState.text}</p>
          <p style={{ margin: 0 }}><strong>Origem:</strong> {sharedState.source}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={handleUpdate}>Atualizar estado</Button>
          <Button variant="secondary" onClick={handleSyncFromSession}>Sincronizar do sessionStorage</Button>
        </div>
      </Card>
    </div>
  );
}

