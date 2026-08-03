import React, { Suspense, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Card, Loading } from '@design-system';
import { publishMessage, subscribeMessage } from '@shared-utils';

// Host simples.
// Responsabilidade: orquestrar o carregamento dos MFEs, definir um roteamento mínimo e exibir estados de loading e erro.
// Por que esta forma: mantemos o host com pouca regra de negócio, focando no fluxo de composição do sistema.

type RemoteModule = { default: React.ComponentType };

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function RemotePanel({ loader, title }: { loader: () => Promise<RemoteModule>; title: string }) {
  const Component = React.lazy(loader);

  return (
    <Card>
      <h3>{title}</h3>
      <ErrorBoundary fallback={<p>O remote não está disponível neste momento.</p>}>
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    </Card>
  );
}

function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || 'dashboard');
  const [lastMessage, setLastMessage] = useState('Nenhuma mensagem ainda');

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace('#', '') || 'dashboard');
    const unsubscribe = subscribeMessage('microfrontends:message', (event: Event) => {
      const detail = (event as CustomEvent<{ text: string }>).detail;
      setLastMessage(detail?.text || 'Mensagem recebida');
    });

    window.addEventListener('hashchange', onHashChange);
    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const remoteLoader = useMemo(() => {
    if (route === 'profile') {
      return () => Promise.resolve({ default: () => null }) as Promise<RemoteModule>;
    }

    return () => Promise.resolve({ default: () => null }) as Promise<RemoteModule>;
  }, [route]);

  const title = route === 'profile' ? 'Profile MFE' : 'Dashboard MFE';

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', display: 'grid', gap: '1rem' }}>
      <h1>Live Microfronts</h1>
      <p>O host é simples: carrega os remotes, define a navegação e exibe loading e fallback.</p>

      <Card>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => {
            window.location.hash = 'dashboard';
            publishMessage('microfrontends:message', { text: 'Dashboard selecionado' });
          }}>Dashboard</Button>
          <Button variant="secondary" onClick={() => {
            window.location.hash = 'profile';
            publishMessage('microfrontends:message', { text: 'Profile selecionado' });
          }}>
            Profile
          </Button>
        </div>
        <p style={{ marginTop: '0.75rem' }}>Última mensagem: {lastMessage}</p>
      </Card>

      <RemotePanel loader={remoteLoader} title={title} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
