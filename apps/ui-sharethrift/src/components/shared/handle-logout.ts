import { ApolloClient } from '@apollo/client';
import { clearStorage } from './local-storage.ts';
import type { AuthContextProps } from 'react-oidc-context';

export const HandleLogout = (
	auth: AuthContextProps,
	apolloClient: ApolloClient,
	post_logout_redirect_uri?: string,
) => {
	// Please do not put await before these 2 functions auth.removeUser() and auth.signoutRedirect() for it will break the logout
	auth.removeUser();
	apolloClient.clearStore();
	clearStorage();
	globalThis.sessionStorage.removeItem('loginPortalType');
	globalThis.sessionStorage.removeItem('redirectTo');

	const redirectUri = post_logout_redirect_uri || globalThis.location.origin;
	auth.signoutRedirect({
		post_logout_redirect_uri: redirectUri,
	});
};
