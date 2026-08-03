import { importShared } from './__federation_fn_import-BOFHdvOP.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CyoIsdjr.js';
import { r as reactDomExports } from './index-D9Af7wOI.js';

var client = {};

var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}

const React = await importShared('react');
const {Button,Card} = await importShared('@design-system');

function DashboardApp() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "1.5rem", display: "grid", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Dashboard MFE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Indicadores" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Vendas: 42" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Usuários ativos: 180" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Ver detalhes" })
    ] })
  ] });
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardApp, {}) })
);
