import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./config/oidc-config.tsx";
import { ApolloConnection } from "./components/shared/apollo-connection.tsx";
import { AppContainer } from "./App.container.tsx";
import "@ant-design/v5-patch-for-react-19";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider {...oidcConfig}>
          <ApolloConnection>
            <AppContainer />
          </ApolloConnection>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  throw new Error('Root element with id "root" not found');
}
