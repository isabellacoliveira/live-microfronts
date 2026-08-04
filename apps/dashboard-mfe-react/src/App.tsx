import { useEffect, useState } from 'react';
import { Button, Card } from '@design-system';
import { getSharedState, publishMessage, setSharedState, subscribeMessage, appendActivity, ActivityEvent } from '@shared-utils';

// Dashboard MFE React.
// Responsabilidade: demonstrar um microfrontend visual com um bloco de métricas.
// O objetivo didático é mostrar que este app pode evoluir independentemente do host.
// Este componente é exposto via Module Federation para o host carregar em runtime.

export default function DashboardApp() {
  const [sharedState, setSharedStateValue] = useState(() => getSharedState());
  const [localCounter, setLocalCounter] = useState(() => getSharedState().counter || 0);
  const [eventLog, setEventLog] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeMessage('microfrontends:shared-state', (event: Event) => {
      const detail = (event as CustomEvent<{ text: string; source: string; scope?: string; counter?: number }>).detail;
      if (detail) {
        const next = { ...getSharedState(), ...detail };
        setSharedStateValue(next);
        if (detail.counter !== undefined) {
          setLocalCounter(detail.counter);
        }
      }
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
    const nextState = setSharedState({ text: 'Dashboard MFE atualizou o estado', source: 'dashboard', scope: 'dashboard' });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: 'Dashboard atualizou o estado', source: 'dashboard' });
  };

  const handleSyncFromSession = () => {
    const nextState = getSharedState();
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: `Sincronizado: ${nextState.text}`, source: 'dashboard' });
  };

  const handleIncrementCounter = () => {
    const nextCounter = (localCounter || 0) + 1;
    setLocalCounter(nextCounter);
    const nextState = setSharedState({
      text: `Dashboard incrementou contador para ${nextCounter}`,
      source: 'dashboard',
      scope: 'dashboard',
      counter: nextCounter,
    });
    setSharedStateValue(nextState);
    appendActivity({
      source: 'dashboard',
      type: 'event',
      label: 'Contador incrementado',
      detail: { counter: nextCounter },
    });
    publishMessage('microfrontends:message', {
      text: `Dashboard: contador = ${nextCounter}`,
      source: 'dashboard',
    });
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
          <p style={{ margin: 0 }}>Meta: {localCounter || 0} concluídas</p>
          <p style={{ margin: 0 }}><strong>Último estado recebido:</strong> {sharedState.text}</p>
          <p style={{ margin: 0 }}><strong>Origem:</strong> {sharedState.source}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={handleIncrementCounter}>Incrementar meta (+1)</Button>
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
