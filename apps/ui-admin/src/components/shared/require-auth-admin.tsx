import { useQuery } from '@apollo/client/react';
import { useEffect, type JSX } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { AppContainerCurrentUserDocument } from '../../generated.tsx';

const { VITE_B2C_ADMIN_REDIRECT_URI, VITE_B2C_REDIRECT_URI } = import.meta.env;
const adminRedirectUri =
	VITE_B2C_ADMIN_REDIRECT_URI ?? VITE_B2C_REDIRECT_URI ?? '';

interface RequireAuthAdminProps {
	children: JSX.Element;
	redirectPath?: string;
	forceLogin?: boolean;
}

export const RequireAuthAdmin: React.FC<RequireAuthAdminProps> = (props) => {
	const auth = useAuth();
	const redirectPath = props.redirectPath ?? '/';
	const {
		data: currentUserData,
		loading: adminLoading,
		error: adminError,
	} = useQuery(AppContainerCurrentUserDocument, {
		skip: !auth.isAuthenticated,
	});
	const isAdmin =
		currentUserData?.currentUserAndCreateIfNotExists?.__typename ===
		'AdminUser';

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
		redirectPath,
	]);

	// automatically refresh token
	useEffect(() => {
		return auth.events.addAccessTokenExpiring(() => {
			auth.signinSilent({
				redirect_uri: adminRedirectUri,
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

	if (adminError) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<div>Unable to verify admin permissions.</div>
			</div>
		);
	}

	if (!isAdmin) {
		return <Navigate to={redirectPath} replace />;
	}

	return props.children;
};
