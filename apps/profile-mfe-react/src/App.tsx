import { useEffect, useState } from 'react';
import { Card, Button, Input } from '@design-system';
import { getSharedState, publishMessage, setSharedState, subscribeMessage } from '@shared-utils';

// Profile MFE React.
// Responsabilidade: demonstrar um microfrontend de perfil com formulário simples.
// O objetivo didático é mostrar que este bloco pode evoluir independentemente do host.
// Este componente é exposto via Module Federation para o host carregar em runtime.

export default function ProfileApp() {
  const [sharedState, setSharedStateValue] = useState(() => getSharedState());

  useEffect(() => {
const unsubscribe = subscribeMessage('microfrontends:shared-state', (event: Event) => {
      const detail = (event as CustomEvent<{ text: string; source: string; scope?: string }>).detail;
      setSharedStateValue(detail ? { ...getSharedState(), ...detail } : getSharedState());
    });

    return unsubscribe;
  }, []);

  const handleUpdate = () => {
    const nextState = setSharedState({ text: 'Profile MFE atualizou o estado', source: 'profile', scope: 'profile' });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: 'Profile atualizou o estado' });
  };

  const handleSyncFromSession = () => {
    const nextState = getSharedState();
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: `Sincronizado: ${nextState.text}` });
  };

  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', color: 'white', padding: '1.25rem', borderRadius: '1rem' }}>
        <h2 style={{ margin: 0 }}>Profile MFE</h2>
        <p style={{ margin: '0.35rem 0 0' }}>Este MFE recebe e envia o mesmo estado compartilhado.</p>
      </div>
      <Card>
        <h3>Dados do usuário</h3>
        <Input placeholder="Nome" />
        <Input placeholder="Email" />
        <p><strong>Último estado recebido:</strong> {sharedState.text}</p>
        <p><strong>Origem:</strong> {sharedState.source}</p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={handleUpdate}>Atualizar estado</Button>
          <Button variant="secondary" onClick={handleSyncFromSession}>Sincronizar do sessionStorage</Button>
        </div>
      </Card>
    </div>
  );
}
