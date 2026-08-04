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

const STORAGE_KEY = "live-microfronts:shared-state";
function getSharedState() {
  if (typeof window === "undefined") {
    return {
      text: "Nenhuma mensagem ainda",
      source: "initial",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        text: "Nenhuma mensagem ainda",
        source: "initial",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      text: "Nenhuma mensagem ainda",
      source: "initial",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
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
  publishMessage("microfrontends:shared-state", nextState);
  return nextState;
}
function publishMessage(eventName, detail) {
  if (typeof window === "undefined") {
    return;
  }
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
function DashboardApp() {
  const [sharedState, setSharedStateValue] = useState(() => getSharedState());
  useEffect(() => {
    const unsubscribe = subscribeMessage("microfrontends:shared-state", (event) => {
      const detail = event.detail;
      setSharedStateValue(detail ?? getSharedState());
    });
    return unsubscribe;
  }, []);
  const handleUpdate = () => {
    const nextState = setSharedState({ text: "Dashboard MFE atualizou o estado", source: "dashboard", scope: "dashboard" });
    setSharedStateValue(nextState);
    publishMessage("microfrontends:message", { text: "Dashboard atualizou o estado" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "1.5rem", display: "grid", gap: "1rem" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Dashboard MFE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Indicadores" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Vendas: 42" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Usuários ativos: 180" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Estado compartilhado: ",
        sharedState.text
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleUpdate, children: "Atualizar estado" })
    ] })
  ] });
}

export { DashboardApp as default, jsxRuntimeExports as j };
