import { useEffect, type JSX } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { useUserIsAdmin } from './hooks/use-user-is-admin.ts';

const { VITE_B2C_REDIRECT_URI } = import.meta.env;

interface RequireAuthAdminProps {
	children: JSX.Element;
	redirectPath?: string;
	forceLogin?: boolean;
}

export const RequireAuthAdmin: React.FC<RequireAuthAdminProps> = (props) => {
	const auth = useAuth();
	const { isAdmin, loading: adminLoading } = useUserIsAdmin();
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
			globalThis.sessionStorage.setItem(
				'redirectTo',
				`${location.pathname}${location.search}`,
			);

			auth.signinRedirect();
		}
	}, [
		auth.isAuthenticated,
		auth.activeNavigator,
		auth.isLoading,
		auth.signinRedirect,
		auth.error,
		props.forceLogin,
		redirectPath,
	]);

	// automatically refresh token
	useEffect(() => {
		return auth.events.addAccessTokenExpiring(() => {
			auth.signinSilent({
				redirect_uri: VITE_B2C_REDIRECT_URI ?? '',
			});
		});
	}, [auth.events, auth.signinSilent]);

	// Check authentication first
	if (!auth.isAuthenticated) {
		if (auth.error) {
			return <Navigate to={redirectPath} replace />;
		}
		if (!auth.isLoading && !auth.activeNavigator && props.forceLogin !== true) {
			return <Navigate to={redirectPath} replace />;
		}
		return <div>Checking authentication...</div>;
	}

	// Then check admin permissions
	if (adminLoading) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div>Checking admin permissions...</div>
			</div>
		);
	}

	if (!isAdmin) {
		return <Navigate to={redirectPath} replace />;
	}

	return props.children;
};
