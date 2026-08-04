import { useEffect, useState } from 'react';
import { Card, Button, Input } from '@design-system';
import { getSharedState, publishMessage, setSharedState, subscribeMessage, appendActivity, ActivityEvent } from '@shared-utils';

// Profile MFE React.
// Responsabilidade: demonstrar um microfrontend de perfil com formulário simples.
// O objetivo didático é mostrar que este bloco pode evoluir independentemente do host.
// Este componente é exposto via Module Federation para o host carregar em runtime.

export default function ProfileApp() {
  const [sharedState, setSharedStateValue] = useState(() => getSharedState());
  const [name, setName] = useState('Isabella Cruz');
  const [email, setEmail] = useState('isabella@exemplo.com');
  const [eventLog, setEventLog] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeMessage('microfrontends:shared-state', (event: Event) => {
      const detail = (event as CustomEvent<{ text: string; source: string; scope?: string }>).detail;
      setSharedStateValue(detail ? { ...getSharedState(), ...detail } : getSharedState());
    });

    const unsubscribeActivity = subscribeMessage('microfrontends:activity', (event: Event) => {
      const entry = (event as CustomEvent<ActivityEvent>).detail;
      if (entry) {
        setEventLog((prev) => [entry, ...prev].slice(0, 15));
      }
    });

    return () => { unsubscribe(); unsubscribeActivity(); };
  }, []);

  const handleUpdate = () => {
    const nextState = setSharedState({ text: 'Profile MFE atualizou o estado', source: 'profile', scope: 'profile' });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: 'Profile atualizou o estado', source: 'profile' });
  };

  const handlePublishProfile = () => {
    appendActivity({
      source: 'profile',
      type: 'event',
      label: 'Perfil atualizado',
      detail: { name, email },
    });
    const nextState = setSharedState({
      text: `Perfil: ${name} <${email}>`,
      source: 'profile',
      scope: 'profile',
    });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', {
      text: `Profile: ${name} atualizou o perfil`,
      source: 'profile',
    });
  };

  const handleSyncFromSession = () => {
    const nextState = getSharedState();
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: `Sincronizado: ${nextState.text}`, source: 'profile' });
  };

  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', color: 'white', padding: '1.25rem', borderRadius: '1rem' }}>
        <h2 style={{ margin: 0 }}>Profile MFE</h2>
        <p style={{ margin: '0.35rem 0 0' }}>Este MFE recebe e envia o mesmo estado compartilhado.</p>
      </div>
      <Card>
        <h3>Dados do usuário</h3>
        <Input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{ height: '0.5rem' }} />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p><strong>Último estado recebido:</strong> {sharedState.text}</p>
        <p><strong>Origem:</strong> {sharedState.source}</p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={handlePublishProfile}>Publicar perfil</Button>
          <Button onClick={handleUpdate}>Atualizar estado</Button>
          <Button variant="secondary" onClick={handleSyncFromSession}>Sincronizar do sessionStorage</Button>
        </div>
      </Card>
      <Card>
        <h3>Log de eventos recebidos</h3>
        {eventLog.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Nenhum evento recebido ainda.</p>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'grid', gap: '0.35rem' }}>
            {eventLog.map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '0.35rem',
                  background: '#f3f4f6',
                  fontSize: '0.8rem',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <span style={{ color: '#6b7280', flexShrink: 0 }}>
                  {new Date(entry.timestamp).toLocaleTimeString('pt-BR')}
                </span>
                <span style={{ fontWeight: 600, flexShrink: 0 }}>{entry.source}</span>
                <span style={{ color: '#4b5563', wordBreak: 'break-all' }}>{entry.label}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
