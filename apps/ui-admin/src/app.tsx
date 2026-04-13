import { Route, Routes } from 'react-router-dom';
import { AppRoutes, AdminLogin, AuthRedirect } from '@sthrift/ui-admin-route-root';
import type React from 'react';

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
