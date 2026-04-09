import { useEffect, type JSX } from 'react';

import { hasAuthParams, useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

export interface RequireAuthProps {
	children: JSX.Element;
	redirectPath?: string;
	forceLogin?: boolean;
	silentRedirectUri?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = (props) => {
	const auth = useAuth();
	const redirectPath = props.redirectPath ?? '/';

	// automatically sign-in
	useEffect(() => {
		if (
			!hasAuthParams() &&
			props.forceLogin === true &&
			!auth.isAuthenticated &&
			!auth.activeNavigator &&
			!auth.isLoading &&
			!auth.error
		) {
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
		auth.isAuthenticated,
		auth.activeNavigator,
		auth.isLoading,
		auth.signinRedirect,
		auth.error,
		props.forceLogin,
		auth,
	]);

	// automatically refresh token
	useEffect(() => {
		return auth.events.addAccessTokenExpiring(() => {
			auth.signinSilent({
				redirect_uri: props.silentRedirectUri ?? '',
			});
		});
	}, [auth, auth.events, auth.signinSilent, props.silentRedirectUri]);

	let result: JSX.Element;
	if (auth.isAuthenticated) {
		result = props.children;
	} else if (auth.error) {
		result = <Navigate to={redirectPath} replace />;
	} else if (
		!auth.isLoading &&
		!auth.activeNavigator &&
		props.forceLogin !== true
	) {
		// If not loading, not in the middle of auth flow, and not forcing login redirect
		result = <Navigate to={redirectPath} replace />;
	} else {
		return <div>Checking auth2...</div>;
	}

	return result;
};
