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

function Input(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      ...props,
      style: {
        padding: "0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid #d1d5db",
        width: "100%"
      }
    }
  );
}

const STORAGE_KEY = "live-microfronts:shared-state";
const ACTIVITY_KEY = "live-microfronts:activity-feed";
const EVENT_STATE = "microfrontends:shared-state";
const INSURANCE_EVENTS = {
  customerUpdated: "customer.updated"};
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
function publish(eventName, payload) {
  publishMessage(eventName, payload);
}

const {useState} = await importShared('react');
const initialValues = {
  name: "Isabella Cruz",
  cpf: "123.456.789-00",
  email: "isabella@exemplo.com",
  phone: "(11) 99999-0000"
};
function RegisterCustomerForm() {
  const [values, setValues] = useState(initialValues);
  const [success, setSuccess] = useState(false);
  const update = (field, value) => {
    setSuccess(false);
    setValues((current) => ({ ...current, [field]: value }));
  };
  const submit = (event) => {
    event.preventDefault();
    const customer = { id: "customer-isabella", ...values };
    setSharedState({
      text: `Cliente atualizado: ${customer.name}`,
      source: "customer-mfe",
      scope: "customer",
      customer
    });
    publish(INSURANCE_EVENTS.customerUpdated, customer);
    setSuccess(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, style: { display: "grid", gap: "0.8rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0 }, children: "Cadastro do cliente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#6b7280", margin: "0.35rem 0 0" }, children: [
        "Ao salvar, este MFE publica ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "customer.updated" }),
        " para os consumidores interessados."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { "aria-label": "Nome", placeholder: "Nome", value: values.name, onChange: (event) => update("name", event.target.value), required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { "aria-label": "CPF", placeholder: "CPF", value: values.cpf, onChange: (event) => update("cpf", event.target.value), required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { "aria-label": "E-mail", type: "email", placeholder: "E-mail", value: values.email, onChange: (event) => update("email", event.target.value), required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { "aria-label": "Telefone", placeholder: "Telefone", value: values.phone, onChange: (event) => update("phone", event.target.value), required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Salvar cadastro" }),
      success && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "status", style: { color: "#047857", fontWeight: 600 }, children: "Cadastro salvo com sucesso." })
    ] })
  ] }) });
}

function CustomerPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "linear-gradient(135deg, #0f766e, #14b8a6)", color: "white", padding: "1.25rem", borderRadius: "1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em" }, children: "MFE CUSTOMER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: "0.35rem 0 0" }, children: "Dados do segurado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0.35rem 0 0" }, children: "Responsabilidade única: manter o cadastro e publicar atualizações do cliente." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterCustomerForm, {})
  ] });
}

function CustomerApp() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerPage, {});
}

export { CustomerApp as default, jsxRuntimeExports as j };
