import { r as reactExports } from './index-Dm_EQZZA.js';
import { importShared } from './__federation_fn_import-gVVR6EuA.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=reactExports,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

function Button({ children, variant = "primary", onClick, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      ...props,
      style: {
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: "1px solid #4f46e5",
        background: variant === "primary" ? "#4f46e5" : "white",
        color: variant === "primary" ? "white" : "#111827",
        cursor: "pointer"
      },
      children
    }
  );
}

function Card({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      style: {
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        padding: "1rem",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      },
      children
    }
  );
}

function Badge({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        display: "inline-block",
        padding: "0.25rem 0.6rem",
        borderRadius: "999px",
        background: "#eef2ff",
        color: "#4338ca",
        fontSize: "0.85rem"
      },
      children
    }
  );
}

const STORAGE_KEY = "live-microfronts:shared-state";
const ACTIVITY_KEY = "live-microfronts:activity-feed";
const EVENT_STATE = "microfrontends:shared-state";
const INSURANCE_EVENTS = {
  customerUpdated: "customer.updated",
  insuranceContracted: "insurance.contracted"
};
function defaultState() {
  return {
    text: "Nenhuma mensagem ainda",
    source: "initial",
    counter: 0,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function getSharedState() {
  if (typeof window === "undefined") {
    return defaultState();
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}
function setSharedState(partial) {
  if (typeof window === "undefined") {
    return getSharedState();
  }
  const nextState = {
    ...getSharedState(),
    ...partial,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  publishMessage(EVENT_STATE, nextState);
  return nextState;
}
function getActivityFeed() {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.sessionStorage.getItem(ACTIVITY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function appendActivity(feedEvent) {
  const entry = {
    ...feedEvent,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (typeof window !== "undefined") {
    const current = getActivityFeed();
    const next = [entry, ...current].slice(0, 50);
    window.sessionStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
    publishMessage("microfrontends:activity", entry);
  }
  return entry;
}
function publishMessage(eventName, detail) {
  if (typeof window === "undefined") {
    return;
  }
  if (eventName === "microfrontends:activity") {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    return;
  }
  const source = detail && typeof detail === "object" && detail.source ? String(detail.source) : "host";
  appendActivity({
    source,
    type: eventName.indexOf("state") !== -1 ? "state" : eventName.indexOf("activity") !== -1 ? "event" : "message",
    label: eventName,
    detail
  });
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}
function subscribeMessage(eventName, handler) {
  if (typeof window === "undefined") {
    return () => void 0;
  }
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
}
function publish(eventName, payload) {
  publishMessage(eventName, payload);
}
function subscribe(eventName, handler) {
  return subscribeMessage(eventName, (event) => {
    handler(event.detail);
  });
}

const insuranceCatalog = [
  { id: "auto", name: "Seguro Auto", price: 189.9, description: "Proteção para colisões, roubo e assistência 24 horas." },
  { id: "residencial", name: "Seguro Residencial", price: 79.9, description: "Cobertura para sua casa, bens e emergências." },
  { id: "vida", name: "Seguro Vida", price: 64.9, description: "Segurança financeira para quem você ama." },
  { id: "viagem", name: "Seguro Viagem", price: 42.9, description: "Assistência médica e proteção durante a viagem." }
];

const {useEffect,useState} = await importShared('react');
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
function InsuranceCatalog() {
  const [customer, setCustomer] = useState(() => getSharedState().customer);
  const [toast, setToast] = useState("");
  useEffect(() => subscribe(INSURANCE_EVENTS.customerUpdated, setCustomer), []);
  const contract = (insurance) => {
    if (!customer) {
      setToast("Cadastre o cliente antes de contratar um seguro.");
      return;
    }
    const insuranceContract = {
      id: `contract-${Date.now()}`,
      customer,
      insurance,
      contractDate: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Ativa"
    };
    setSharedState({
      text: `${customer.name} contratou ${insurance.name}`,
      source: "insurance-catalog-mfe",
      scope: "insurance",
      customer,
      insuranceContract
    });
    publish(INSURANCE_EVENTS.insuranceContracted, insuranceContract);
    setToast(`${insurance.name} contratado com sucesso.`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: customer ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: "Cliente identificado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { style: { margin: "0.5rem 0 0" }, children: [
        "Olá, ",
        customer.name.split(" ")[0]
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0.35rem 0 0", color: "#6b7280" }, children: "Escolha a proteção mais adequada para este momento." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: "Etapa 1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0.5rem 0 0" }, children: "Aguardando cadastro" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "0.35rem 0 0", color: "#6b7280" }, children: [
        "Este MFE consome o evento ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "customer.updated" }),
        "."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }, children: insuranceCatalog.map((insurance) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: "Proteção" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginBottom: "0.35rem" }, children: insurance.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { minHeight: "3rem", marginTop: 0, color: "#6b7280", fontSize: "0.92rem" }, children: insurance.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { style: { display: "block", fontSize: "1.15rem", marginBottom: "1rem" }, children: [
        money.format(insurance.price),
        "/mês"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => contract(insurance), children: "Contratar seguro" })
    ] }, insurance.id)) }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "status", style: { padding: "0.85rem 1rem", background: "#ecfdf5", color: "#047857", borderRadius: "0.75rem", fontWeight: 600 }, children: toast })
  ] });
}

function CatalogPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "white", padding: "1.25rem", borderRadius: "1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em" }, children: "MFE INSURANCE CATALOG" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: "0.35rem 0 0" }, children: "Encontre a proteção ideal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "0.35rem 0 0" }, children: [
        "Responsabilidade única: ofertar seguros e publicar ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "insurance.contracted" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InsuranceCatalog, {})
  ] });
}

function InsuranceCatalogApp() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CatalogPage, {});
}

export { InsuranceCatalogApp as default, jsxRuntimeExports as j };
