import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Badge, Button, Card, Loading } from "@design-system";
import { ArchitecturePage } from "./pages/architecture-page/ui/ArchitecturePage";
import {
  INSURANCE_EVENTS,
  postMessageToIframe,
  subscribe,
  type InsuranceContract,
} from "@shared-utils";

// Formato esperado do módulo remoto: um componente React na exportação default.
// React.lazy precisa desse formato para renderizar o componente depois do import.
type RemoteModule = { default: React.ComponentType };
type Route =
  | "dashboard"
  | "customer"
  | "catalog"
  | "notifications"
  | "architecture";

// O Shell mantém a estrutura comum e escolhe qual experiência renderizar.
// As rotas Customer e Catalog são fornecidas por remotes React; Notifications
// é uma aplicação Angular separada, incorporada por iframe.

// ErrorBoundary é o "plano B" para erros ao renderizar a área do remote:
// mostra uma mensagem no lugar dessa área, preservando o restante do Host.
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Os imports dinâmicos são funções: não são executados ao abrir o Host.
// React.lazy chama a função correspondente quando a rota do remote é renderizada.
//
// O endereço de cada remote fica em vite.config.ts. Ao carregar um remote,
// o runtime Federation busca seu remoteEntry.js, que indica como encontrar o
// módulo exposto e seus arquivos. O build pode dividir o código em "chunks":
// arquivos menores de JavaScript carregados conforme necessário. No DevTools,
// a aba Network mostra o remoteEntry.js e os chunks buscados pelo navegador.
const remoteLoaders: Record<
  "customer" | "catalog",
  () => Promise<RemoteModule>
> = {
  customer: async () => {
    try {
      // O nome lógico profile_mfe/App é associado à URL do remote no vite.config.ts.
      // "App" corresponde ao módulo "./App" exposto pelo MFE Cliente.
      return await import("profile_mfe/App");
    } catch {
      // Se o import falhar, entregamos um componente de fallback ao React.lazy.
      return { default: () => <p>O MFE Customer não está disponível.</p> };
    }
  },
  catalog: async () => {
    try {
      // O alias dashboard_mfe também é configurado como remote no Vite.
      return await import("dashboard_mfe/App");
    } catch {
      return {
        default: () => <p>O MFE Insurance Catalog não está disponível.</p>,
      };
    }
  },
};

// Mantém a identidade dos tipos lazy entre renders do Host; recriá-los poderia
// desmontar o remote e perder estado mesmo sem trocar de rota.
const LazyRemotes = {
  customer: React.lazy(remoteLoaders.customer),
  catalog: React.lazy(remoteLoaders.catalog),
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const date = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function RemoteContainer({ route }: { route: "customer" | "catalog" }) {
  // Escolhe o componente lazy da rota. Ao renderizá-lo, React inicia o import.
  // Suspense exibe Loading enquanto o módulo está sendo resolvido; depois,
  // React renderiza o componente remoto na mesma árvore React do Host.
  // Se a renderização falhar, ErrorBoundary exibe seu próprio fallback.
  const Component = LazyRemotes[route];
  return (
    // ErrorBoundary protege esta área: se o componente remoto falhar durante
    // a renderização, troca seu conteúdo pelo Card informado em fallback.
    <ErrorBoundary
      fallback={<Card>Não foi possível carregar este microfrontend.</Card>}
    >
      {/* Suspense mostra Loading enquanto React aguarda o módulo remoto. */}
      <Suspense fallback={<Loading />}>
        {/* Component é o MFE React selecionado para a rota atual. */}
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

function PortalDashboard({ contracts }: { contracts: InsuranceContract[] }) {
  const customer = contracts[0]?.customer;
  const total = contracts.reduce(
    (sum, contract) => sum + contract.insurance.price,
    0,
  );
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #172554, #2563eb)",
          color: "white",
          padding: "1.5rem",
          borderRadius: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          HOST DASHBOARD
        </span>
        <h2 style={{ margin: "0.35rem 0 0" }}>Visão consolidada da carteira</h2>
        <p style={{ margin: "0.35rem 0 0" }}>
          O Host somente consome <strong>insurance.contracted</strong>; não
          contrata seguros.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        <Card>
          <span style={{ color: "#6b7280" }}>Cliente</span>
          <h3 style={{ marginBottom: 0 }}>
            {customer?.name ?? "Aguardando cadastro"}
          </h3>
        </Card>
        <Card>
          <span style={{ color: "#6b7280" }}>Seguros contratados</span>
          <h3 style={{ marginBottom: 0 }}>{contracts.length}</h3>
        </Card>
        <Card>
          <span style={{ color: "#6b7280" }}>Valor mensal</span>
          <h3 style={{ marginBottom: 0 }}>{currency.format(total)}</h3>
        </Card>
      </div>
      <Card>
        <h3 style={{ marginTop: 0 }}>Seguros contratados</h3>
        {contracts.length === 0 ? (
          <p style={{ color: "#6b7280", margin: 0 }}>
            Nenhuma contratação ainda. Cadastre o cliente e escolha um seguro no
            catálogo.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                  <th style={{ padding: "0.6rem" }}>Seguro</th>
                  <th style={{ padding: "0.6rem" }}>Valor</th>
                  <th style={{ padding: "0.6rem" }}>Data</th>
                  <th style={{ padding: "0.6rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr
                    key={contract.id}
                    style={{ borderTop: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: "0.75rem 0.6rem", fontWeight: 600 }}>
                      {contract.insurance.name}
                    </td>
                    <td style={{ padding: "0.75rem 0.6rem" }}>
                      {currency.format(contract.insurance.price)}
                    </td>
                    <td style={{ padding: "0.75rem 0.6rem" }}>
                      {date.format(new Date(contract.contractDate))}
                    </td>
                    <td style={{ padding: "0.75rem 0.6rem" }}>
                      <Badge>{contract.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function NotificationsFrame({ contracts }: { contracts: InsuranceContract[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    // Angular não é importado via Federation: o navegador abre sua aplicação
    // independente dentro do iframe, em seu próprio documento e runtime.
    // O ref permite acessar a janela do iframe (contentWindow); postMessage
    // envia os contratos para essa outra janela, sem importar código Angular.
    const forwardContracts = () =>
      postMessageToIframe(iframeRef.current?.contentWindow ?? null, {
        insuranceContracts: contracts,
      });
    // Envia também após atualizar os contratos; o intervalo cobre o caso em que
    // o iframe ainda não carregou quando a tela de notificações foi montada.
    forwardContracts();
    const timer = window.setInterval(forwardContracts, 1200);
    // Na desmontagem ou mudança dos contratos, limpa o intervalo anterior.
    return () => window.clearInterval(timer);
  }, [contracts]);
  return (
    <iframe
      ref={iframeRef}
      title="Notifications MFE (Angular)"
      // A URL aponta para o servidor do MFE Angular, configurado na porta 5003.
      src="http://127.0.0.1:5003/"
      style={{
        width: "100%",
        height: "620px",
        border: "1px solid #e5e7eb",
        borderRadius: "1rem",
        background: "white",
      }}
    />
  );
}

function App() {
  // O hash mantém a rota na URL e permite ao Shell decidir qual MFE compor.
  const [route, setRoute] = useState<Route>(
    () => (window.location.hash.slice(1) as Route) || "dashboard",
  );
  const [contracts, setContracts] = useState<InsuranceContract[]>([]);

  useEffect(() => {
    const onHashChange = () =>
      setRoute((window.location.hash.slice(1) as Route) || "dashboard");
    window.addEventListener("hashchange", onHashChange);
    // subscribe registra um ouvinte para o evento publicado pelo Catálogo.
    // Assim o Host atualiza a visão consolidada sem importar a contratação.
    const unsubscribe = subscribe<InsuranceContract>(
      INSURANCE_EVENTS.insuranceContracted,
      (contract) => {
        setContracts((current) =>
          current.some((item) => item.id === contract.id)
            ? current
            : [contract, ...current],
        );
      },
    );
    // A limpeza remove os ouvintes quando este efeito é desmontado.
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      unsubscribe();
    };
  }, []);

  const content = useMemo(() => {
    // Composição do Shell: Cliente/Catálogo entram como componentes React
    // federados; Notificações abre uma página Angular no iframe; Dashboard
    // e Arquitetura são telas do próprio Host.
    // Ao trocar de rota, React desmonta a tela anterior e monta a nova.
    if (route === "customer" || route === "catalog")
      return <RemoteContainer route={route} />;
    if (route === "notifications")
      return <NotificationsFrame contracts={contracts} />;
    if (route === "architecture") return <ArchitecturePage />;
    return <PortalDashboard contracts={contracts} />;
  }, [route, contracts]);
  const labels: Record<Route, string> = {
    dashboard: "Dashboard",
    customer: "Cliente",
    catalog: "Catálogo de seguros",
    notifications: "Notificações",
    architecture: "Arquitetura",
  };
  const navigate = (next: Route) => {
    window.location.hash = next;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#172554",
      }}
    >
      <header
        style={{
          padding: "1rem 1.5rem",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong style={{ fontSize: "1.2rem" }}>Nexo Seguros</strong>
          <span style={{ color: "#64748b", marginLeft: "0.7rem" }}>
            Insurance Portal
          </span>
        </div>
        <Badge>
          {contracts.length} apólice{contracts.length === 1 ? "" : "s"} ativa
          {contracts.length === 1 ? "" : "s"}
        </Badge>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px minmax(0, 1fr)",
          minHeight: "calc(100vh - 65px)",
        }}
      >
        <aside
          style={{
            padding: "1rem",
            background: "#0f172a",
            display: "grid",
            alignContent: "start",
            gap: "0.5rem",
          }}
        >
          {(Object.keys(labels) as Route[]).map((item) => (
            <Button
              key={item}
              variant={route === item ? "primary" : "secondary"}
              onClick={() => navigate(item)}
              style={{ textAlign: "left" }}
            >
              {labels[item]}
            </Button>
          ))}
        </aside>
        <main
          style={{
            padding: "1.5rem",
            maxWidth: "1200px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <p style={{ color: "#64748b", marginTop: 0 }}>
            Portal / {labels[route]}
          </p>
          {content}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
