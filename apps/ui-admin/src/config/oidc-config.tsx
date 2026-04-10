const {
	VITE_B2C_ADMIN_AUTHORITY,
	VITE_B2C_ADMIN_CLIENTID,
	VITE_B2C_ADMIN_REDIRECT_URI,
	VITE_B2C_ADMIN_SCOPE,
} = import.meta.env;

export const oidcConfig = {
	authority: VITE_B2C_ADMIN_AUTHORITY ?? '',
	client_id: VITE_B2C_ADMIN_CLIENTID ?? '',
	redirect_uri: VITE_B2C_ADMIN_REDIRECT_URI ?? '',
	code_verifier: true,
	noonce: true,
	response_type: 'code',
	scope: VITE_B2C_ADMIN_SCOPE,
	onSigninCallback: (): void => {
		globalThis.history.replaceState(
			{},
			document.title,
			globalThis.location.pathname,
		);
		const redirectToPath = globalThis.sessionStorage.getItem('redirectTo');
		if (redirectToPath) {
			globalThis.location.pathname = redirectToPath;
			globalThis.sessionStorage.removeItem('redirectTo');
		}
	},
};
