import React, { Suspense, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Card, Input, Loading } from '@design-system';
import { getSharedState, publishMessage, setSharedState, subscribeMessage } from '@shared-utils';

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

// Carregadores reais dos remotes via Module Federation.
// Quando o runtime remoto não estiver disponível, o host usa o componente local como fallback.
const remoteLoaders: Record<string, () => Promise<RemoteModule>> = {
  dashboard: async () => {
    try {
      return await import('dashboard_mfe/App');
    } catch {
      return { default: () => <p>O remote do dashboard não carregou em runtime.</p> };
    }
  },
  profile: async () => {
    try {
      return await import('profile_mfe/App');
    } catch {
      return { default: () => <p>O remote do profile não carregou em runtime.</p> };
    }
  },
};

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
  const [draftValue, setDraftValue] = useState(() => getSharedState().text);
  const [sharedState, setSharedStateValue] = useState(() => getSharedState());

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace('#', '') || 'dashboard');
    const unsubscribeMessage = subscribeMessage('microfrontends:message', (event: Event) => {
      const detail = (event as CustomEvent<{ text: string }>).detail;
      setLastMessage(detail?.text || 'Mensagem recebida');
    });
    const unsubscribeState = subscribeMessage('microfrontends:shared-state', (event: Event) => {
      const detail = (event as CustomEvent<{ text: string; source: string; scope?: string }>).detail;
      const nextState = detail ?? getSharedState();
      setSharedStateValue(nextState);
      setDraftValue(nextState.text);
    });

    window.addEventListener('hashchange', onHashChange);
    return () => {
      unsubscribeMessage();
      unsubscribeState();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const remoteLoader = useMemo(() => {
    const loader = remoteLoaders[route];
    return loader ?? (() => Promise.resolve({ default: () => null }) as Promise<RemoteModule>);
  }, [route]);

  const title = route === 'profile' ? 'Profile MFE' : 'Dashboard MFE';

  const handleRouteChange = (nextRoute: string) => {
    window.location.hash = nextRoute;
    const message = nextRoute === 'profile' ? 'Profile selecionado' : 'Dashboard selecionado';
    const nextState = setSharedState({ text: `${message} via host`, source: 'host', scope: nextRoute });
    setSharedStateValue(nextState);
    setDraftValue(nextState.text);
    publishMessage('microfrontends:message', { text: message });
  };

  const handleShare = () => {
    const nextState = setSharedState({ text: draftValue || 'Estado compartilhado', source: 'host', scope: route });
    setSharedStateValue(nextState);
    publishMessage('microfrontends:message', { text: `Estado compartilhado: ${nextState.text}` });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', display: 'grid', gap: '1rem' }}>
      <h1>Live Microfronts</h1>
      <p>O host é simples: carrega os remotes, define a navegação e exibe loading e fallback.</p>

      <Card>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button onClick={() => handleRouteChange('dashboard')}>Dashboard</Button>
          <Button variant="secondary" onClick={() => handleRouteChange('profile')}>
            Profile
          </Button>
        </div>
        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
          <Input
            value={draftValue}
            onChange={(event) => setDraftValue(event.target.value)}
            placeholder="Escreva algo para compartilhar"
          />
          <Button onClick={handleShare}>Compartilhar via sessionStorage</Button>
        </div>
        <p style={{ marginTop: '0.75rem' }}>Última mensagem: {lastMessage}</p>
        <p>Estado compartilhado: {sharedState.text}</p>
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
