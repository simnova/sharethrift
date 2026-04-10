import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './config/oidc-config.tsx';
import { ApolloConnection } from '@sthrift/ui-shared';
import { ApolloManualMergeCacheFix } from './components/shared/apollo-manual-merge-cache-fix.ts';
import { AppContainer } from './app.container.tsx';
import '@ant-design/v5-patch-for-react-19';

const {
	VITE_BLOB_STORAGE_CONFIG_URL,
	VITE_FUNCTION_ENDPOINT,
	NODE_ENV,
} = import.meta.env;

const rootElement = document.getElementById('root');
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<BrowserRouter>
				<AuthProvider {...oidcConfig}>
					<ApolloConnection config={{
						blobStorageUrl: VITE_BLOB_STORAGE_CONFIG_URL,
						functionEndpoint: VITE_FUNCTION_ENDPOINT,
						isProduction: NODE_ENV === 'production',
						cache: ApolloManualMergeCacheFix,
					}}>
						<AppContainer />
					</ApolloConnection>
				</AuthProvider>
			</BrowserRouter>
		</StrictMode>,
	);
} else {
	throw new Error('Root element with id "root" not found');
}
