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
      const detail = (event as CustomEvent<{ text: string; source: string }>).detail;
      setSharedStateValue(detail ?? getSharedState());
    });

    return unsubscribe;
  }, []);

  const handleUpdate = () => {
    const nextState = setSharedState({ text: 'Profile MFE atualizou o estado', source: 'profile', scope: 'profile' });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: 'Profile atualizou o estado' });
  };

  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <h2>Profile MFE</h2>
      <Card>
        <h3>Dados do usuário</h3>
        <Input placeholder="Nome" />
        <Input placeholder="Email" />
        <p>Estado compartilhado: {sharedState.text}</p>
        <Button onClick={handleUpdate}>Atualizar estado</Button>
      </Card>
    </div>
  );
}
