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
const {Card,Button,Input} = await importShared('@design-system');

function ProfileApp() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "1.5rem", display: "grid", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Profile MFE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Dados do usuário" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Nome" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Email" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Salvar" })
    ] })
  ] });
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileApp, {}) })
);
