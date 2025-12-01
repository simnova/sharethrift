import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './config/oidc-config.tsx';
import { ApolloConnection } from './components/shared/apollo-connection.tsx';
import { AppContainer } from './App.container.tsx';
import '@ant-design/v5-patch-for-react-19';
import { oidcConfigAdmin } from './config/oidc-config-admin.tsx';

// Determine which OAuth config to use based on session storage
const portalType = globalThis.sessionStorage.getItem("loginPortalType");
const selectedConfig = portalType === "AdminPortal" ? oidcConfigAdmin : oidcConfig;

const rootElement = document.getElementById('root');
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<BrowserRouter>
				<AuthProvider {...selectedConfig}>
					<ApolloConnection>
						<AppContainer />
					</ApolloConnection>
				</AuthProvider>
			</BrowserRouter>
		</StrictMode>,
	);
} else {
	throw new Error('Root element with id "root" not found');
}


