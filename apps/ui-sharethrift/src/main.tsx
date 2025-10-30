import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./config/oidc-config.tsx";
import { oidcConfigAdmin } from "./config/oidc-config-admin.tsx";

// Determine which OAuth config to use based on session storage
const portalType = globalThis.sessionStorage.getItem("loginPortalType");
const selectedConfig =
  portalType === "AdminPortal" ? oidcConfigAdmin : oidcConfig;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider {...selectedConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
