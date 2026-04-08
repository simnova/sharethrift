import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

export const AuthRedirect: React.FC = () => {
	const auth = useAuth();

	useEffect(() => {
		if (!auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
			globalThis.sessionStorage.setItem(
				'redirectTo',
				`${location.pathname}${location.search}`
			);
			auth.signinRedirect();
		}
	}, [auth]);

	if (auth.isAuthenticated) {
		const redirectTo =
			globalThis.sessionStorage.getItem('redirectTo') || '/';
		globalThis.sessionStorage.removeItem('redirectTo');
		return <Navigate to={redirectTo} />;
	}

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
