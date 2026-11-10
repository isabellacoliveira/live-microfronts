import { Badge, Card } from "@design-system";

const architectureSteps = [
  {
    step: "1",
    title: "Host escolhe uma rota",
    description:
      "A navegação do Host decide quando a tela de Cliente ou Catálogo deve ser exibida.",
    label: "Shell / Host",
  },
  {
    step: "2",
    title: "Remote é carregado sob demanda",
    description:
      "React.lazy chama o import federado. O navegador busca o remoteEntry.js e, em seguida, os arquivos do módulo exposto.",
    label: "Dynamic loading",
  },
  {
    step: "3",
    title: "A interface entra na árvore React",
    description:
      "O Host renderiza o componente exposto na rota atual. Ao sair da rota, o componente é removido e seus efeitos devem limpar assinaturas e timers.",
    label: "Mount / unmount",
  },
];

const concepts = [
  {
    title: "Webpack e Module Federation",
    description:
      "Module Federation ficou conhecido como recurso do Webpack 5. Este projeto usa Vite com @originjs/vite-plugin-federation; não há configuração Webpack aqui.",
  },
  {
    title: "Shared não significa isolamento",
    description:
      "A configuração Federation declara React e React DOM como dependências shared; versões e estratégia de instância ainda precisam ser compatíveis. O design system é importado por alias do monorepo, não pela lista shared do Federation.",
  },
  {
    title: "Remotes React rodam no contexto do Host",
    description:
      "Um componente federado React não é uma sandbox: ele participa da mesma página e do mesmo contexto JavaScript. O MFE Angular deste exemplo é carregado em um iframe, que tem contexto de janela próprio.",
  },
];

const codeLocations = [
  {
    name: "Host: imports, rotas e fallbacks",
    path: "apps/host-react/src/main.tsx",
  },
  {
    name: "Host: URLs dos remotes e shared",
    path: "apps/host-react/vite.config.ts",
  },
  {
    name: "Catálogo: módulo exposto",
    path: "apps/dashboard-mfe-react/vite.config.ts",
  },
  {
    name: "Cliente: publicação do evento",
    path: "apps/profile-mfe-react/src/features/register-customer/ui/RegisterCustomerForm.tsx",
  },
  {
    name: "Contrato e comunicação",
    path: "packages/shared-utils/src/communication.ts",
  },
];

export function ArchitecturePage() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Card>
        <Badge>Mapa da arquitetura</Badge>
        <h2 style={{ marginBottom: "0.5rem" }}>Como a tela chega ao Host</h2>
        <p style={{ color: "#475569", margin: 0 }}>
          O Host é o shell da experiência. Ele decide qual remote mostrar,
          enquanto cada MFE mantém sua própria implementação de domínio.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "0.75rem",
            marginTop: "1.25rem",
          }}
        >
          {architectureSteps.map((item) => (
            <section
              key={item.step}
              style={{
                border: "1px solid #dbeafe",
                borderRadius: "0.75rem",
                padding: "1rem",
                background: "#f8fafc",
                position: "relative",
              }}
            >
              <Badge>Etapa {item.step}</Badge>
              <h3 style={{ margin: "0.75rem 0 0.4rem" }}>{item.title}</h3>
              <p style={{ color: "#475569", margin: "0 0 0.75rem" }}>
                {item.description}
              </p>
              <strong style={{ color: "#1d4ed8", fontSize: "0.85rem" }}>
                {item.label}
              </strong>
            </section>
          ))}
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {concepts.map((concept) => (
          <Card key={concept.title}>
            <h3 style={{ marginTop: 0 }}>{concept.title}</h3>
            <p style={{ color: "#475569", marginBottom: 0 }}>
              {concept.description}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 style={{ marginTop: 0 }}>Onde ver no código</h3>
        <ol style={{ display: "grid", gap: "0.5rem", marginBottom: 0 }}>
          {codeLocations.map((location) => (
            <li key={location.path}>
              <strong>{location.name}:</strong>{" "}
              <code>{location.path}</code>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
