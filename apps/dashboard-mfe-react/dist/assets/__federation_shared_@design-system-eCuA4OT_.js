import { j as jsxRuntimeExports } from './jsx-runtime-CyoIsdjr.js';

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

function Loading() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-label": "loading", children: "Carregando..." });
}

const theme = {
  colors: {
    primary: "#4f46e5",
    secondary: "#111827",
    muted: "#6b7280"
  }
};

const tokens = {
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem"
  },
  radius: {
    md: "0.5rem"
  }
};

export { Badge, Button, Card, Input, Loading, theme, tokens };
