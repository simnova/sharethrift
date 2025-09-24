export const oidcConfig = {
	authority: import.meta.env['VITE_B2C_AUTHORITY'] ?? '',
	client_id: import.meta.env['VITE_B2C_CLIENTID'] ?? '',
	redirect_uri: import.meta.env['VITE_B2C_REDIRECT_URI'] ?? '',
	code_verifier: true,
	noonce: true,
	response_type: 'code',
	scope: import.meta.env['VITE_B2C_SCOPE'],
	onSigninCallback: (_user: any | void): void => {
		window.history.replaceState({}, document.title, window.location.pathname);
		const redirectToPath = window.sessionStorage.getItem('redirectTo');
		if (redirectToPath) {
			window.location.pathname = redirectToPath;
			window.sessionStorage.removeItem('redirectTo');
		}
	},
};
