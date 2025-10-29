import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './config/oidc-config.tsx';
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider {...oidcConfig}>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
