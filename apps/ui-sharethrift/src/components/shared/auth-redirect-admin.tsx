import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

export const AuthRedirectAdmin: React.FC = () => {
	const auth = useAuth();

	useEffect(() => {
		if (!auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
			// Store the current path for redirect after login
			globalThis.sessionStorage.setItem(
				'redirectTo',
				`${location.pathname}${location.search}`
			);
			auth.signinRedirect();
		}
	}, [auth]);

	// If authenticated, redirect
	if (auth.isAuthenticated) {
		const redirectTo =
			globalThis.sessionStorage.getItem('redirectTo') || '/';
		globalThis.sessionStorage.removeItem('redirectTo');
		return <Navigate to={redirectTo} />;
	}

	// Show loading while checking auth
	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div>Redirecting to login...</div>
		</div>
	);
};
