const {
	VITE_B2C_AUTHORITY,
	VITE_B2C_CLIENTID,
	VITE_B2C_REDIRECT_URI,
	VITE_B2C_SCOPE,
} = import.meta.env;

export const oidcConfig = {
	authority: VITE_B2C_AUTHORITY ?? '',
	client_id: VITE_B2C_CLIENTID ?? '',
	redirect_uri: VITE_B2C_REDIRECT_URI ?? '',
	code_verifier: true,
	noonce: true,
	response_type: 'code',
	scope: VITE_B2C_SCOPE,
	onSigninCallback: (): void => {
		globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
		const redirectToPath = globalThis.sessionStorage.getItem('redirectTo');
		if (redirectToPath) {
			globalThis.location.pathname = redirectToPath;
			globalThis.sessionStorage.removeItem('redirectTo');
		}
		// Clear the portal type after successful login
		globalThis.sessionStorage.removeItem('loginPortalType');
	},
};
