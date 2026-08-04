import { importShared } from './__federation_fn_import-gVVR6EuA.js';
import { r as reactExports } from './index-Dm_EQZZA.js';

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

const {useEffect,useState} = await importShared('react');
function ProfileApp() {
  const [sharedState, setSharedStateValue] = useState(() => getSharedState());
  const [name, setName] = useState("Isabella Cruz");
  const [email, setEmail] = useState("isabella@exemplo.com");
  const [eventLog, setEventLog] = useState([]);
  useEffect(() => {
    const unsubscribe = subscribeMessage("microfrontends:shared-state", (event) => {
      const detail = event.detail;
      setSharedStateValue(detail ? { ...getSharedState(), ...detail } : getSharedState());
    });
    const unsubscribeActivity = subscribeMessage("microfrontends:activity", (event) => {
      const entry = event.detail;
      if (entry) {
        setEventLog((prev) => [entry, ...prev].slice(0, 15));
      }
    });
    return () => {
      unsubscribe();
      unsubscribeActivity();
    };
  }, []);
  const handleUpdate = () => {
    const nextState = setSharedState({ text: "Profile MFE atualizou o estado", source: "profile", scope: "profile" });
    setSharedStateValue(nextState);
    publishMessage("microfrontends:message", { text: "Profile atualizou o estado", source: "profile" });
  };
  const handlePublishProfile = () => {
    appendActivity({
      source: "profile",
      type: "event",
      label: "Perfil atualizado",
      detail: { name, email }
    });
    const nextState = setSharedState({
      text: `Perfil: ${name} <${email}>`,
      source: "profile",
      scope: "profile"
    });
    setSharedStateValue(nextState);
    publishMessage("microfrontends:message", {
      text: `Profile: ${name} atualizou o perfil`,
      source: "profile"
    });
  };
  const handleSyncFromSession = () => {
    const nextState = getSharedState();
    setSharedStateValue(nextState);
    publishMessage("microfrontends:message", { text: `Sincronizado: ${nextState.text}`, source: "profile" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "1.5rem", display: "grid", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "linear-gradient(135deg, #0f766e, #14b8a6)", color: "white", padding: "1.25rem", borderRadius: "1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: 0 }, children: "Profile MFE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0.35rem 0 0" }, children: "Este MFE recebe e envia o mesmo estado compartilhado." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Dados do usuário" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Nome",
          value: name,
          onChange: (e) => setName(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "0.5rem" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Email",
          value: email,
          onChange: (e) => setEmail(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Último estado recebido:" }),
        " ",
        sharedState.text
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Origem:" }),
        " ",
        sharedState.source
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handlePublishProfile, children: "📤 Enviar perfil ao Host (compartilha com Dashboard e Angular)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleUpdate, children: "📤 Enviar atualização de volta ao Host" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "secondary", onClick: handleSyncFromSession, children: "📥 Receber estado atual do Host" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Log de eventos recebidos" }),
      eventLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: "Nenhum evento recebido ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxHeight: "200px", overflowY: "auto", display: "grid", gap: "0.35rem" }, children: eventLog.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            padding: "0.35rem 0.65rem",
            borderRadius: "0.35rem",
            background: "#f3f4f6",
            fontSize: "0.8rem",
            display: "flex",
            gap: "0.5rem"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#6b7280", flexShrink: 0 }, children: new Date(entry.timestamp).toLocaleTimeString("pt-BR") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, flexShrink: 0 }, children: entry.source }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#4b5563", wordBreak: "break-all" }, children: entry.label })
          ]
        },
        entry.id
      )) })
    ] })
  ] });
}

export { ProfileApp as default, jsxRuntimeExports as j };
