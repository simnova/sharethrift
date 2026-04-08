const {
	VITE_B2C_ADMIN_AUTHORITY,
	VITE_B2C_ADMIN_CLIENTID,
	VITE_B2C_ADMIN_REDIRECT_URI,
	VITE_B2C_ADMIN_SCOPE,
	VITE_B2C_AUTHORITY,
	VITE_B2C_CLIENTID,
	VITE_B2C_REDIRECT_URI,
	VITE_B2C_SCOPE,
} = import.meta.env;

const adminAuthority = VITE_B2C_ADMIN_AUTHORITY ?? VITE_B2C_AUTHORITY ?? '';
const adminClientId = VITE_B2C_ADMIN_CLIENTID ?? VITE_B2C_CLIENTID ?? '';
const adminRedirectUri =
	VITE_B2C_ADMIN_REDIRECT_URI ?? VITE_B2C_REDIRECT_URI ?? '';
const adminScope = VITE_B2C_ADMIN_SCOPE ?? VITE_B2C_SCOPE;

export const oidcConfig = {
	authority: adminAuthority,
	client_id: adminClientId,
	redirect_uri: adminRedirectUri,
	code_verifier: true,
	noonce: true,
	response_type: 'code',
	scope: adminScope,
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
