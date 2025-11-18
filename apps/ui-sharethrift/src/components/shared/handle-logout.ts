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
	if (post_logout_redirect_uri) {
		auth.signoutRedirect({
			post_logout_redirect_uri: post_logout_redirect_uri,
		});

		return;
	}

	auth.signoutRedirect();
	//globalThis.location.href = '/'; //would return to home page after logout
};
