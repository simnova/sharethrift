import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './config/oidc-config.tsx';
import '@ant-design/v5-patch-for-react-19';
import { oidcConfigAdmin } from './config/oidc-config-admin.tsx';

// Determine which OAuth config to use based on session storage
const portalType = globalThis.sessionStorage.getItem("loginPortalType");
const selectedConfig = portalType === "AdminPortal" ? oidcConfigAdmin : oidcConfig;

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider {...selectedConfig}>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
