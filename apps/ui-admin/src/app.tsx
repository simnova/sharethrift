import { Route, Routes } from 'react-router-dom';
import { AppRoutes } from './components/layouts/app/index.tsx';
import type React from 'react';
import { AdminLogin } from './components/shared/admin-login.tsx';
import { AuthRedirect } from './components/shared/auth-redirect.tsx';

interface AppProps {
	isAuthenticated: boolean;
}
export const App: React.FC<AppProps> = () => {
	return (
		<Routes>
			<Route path="/*" element={<AppRoutes />} />
			<Route path="/login" element={<AdminLogin />} />
			<Route path="/auth-redirect" element={<AuthRedirect />} />
		</Routes>
	);
};
