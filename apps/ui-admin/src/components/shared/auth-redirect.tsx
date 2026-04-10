import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

export const AuthRedirect: React.FC = () => {
	const auth = useAuth();

	useEffect(() => {
		if (!auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
			const currentPath = `${globalThis.location.pathname}${globalThis.location.search}`;
			const hasRedirectTarget = Boolean(
				globalThis.sessionStorage.getItem('redirectTo'),
			);
			const isAuthEntryPath =
				currentPath === '/login' || currentPath.startsWith('/auth-redirect');

			if (!hasRedirectTarget && !isAuthEntryPath) {
				globalThis.sessionStorage.setItem('redirectTo', currentPath);
			}

			auth.signinRedirect();
		}
	}, [
		auth.activeNavigator,
		auth.isAuthenticated,
		auth.isLoading,
		auth.signinRedirect,
	]);

	if (auth.isAuthenticated) {
		const redirectTo = globalThis.sessionStorage.getItem('redirectTo') || '/';
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
