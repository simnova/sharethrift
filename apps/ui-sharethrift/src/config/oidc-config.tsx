export const oidcConfig = {
	authority: import.meta.env['VITE_B2C_AUTHORITY'] ?? '',
	client_id: import.meta.env['VITE_B2C_CLIENTID'] ?? '',
	redirect_uri: import.meta.env['VITE_B2C_REDIRECT_URI'] ?? '',
	code_verifier: true,
	noonce: true,
	response_type: 'code',
	scope: import.meta.env['VITE_B2C_SCOPE'],
	onSigninCallback: (): void => {
		globalThis.history.replaceState(
			{},
			document.title,
			globalThis.location.pathname
		);
		const redirectToPath = globalThis.sessionStorage.getItem('redirectTo');
		if (redirectToPath) {
			globalThis.location.pathname = redirectToPath;
			globalThis.sessionStorage.removeItem('redirectTo');
		}
	},
};
