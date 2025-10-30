/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_B2C_CLIENTID: string;
	readonly VITE_B2C_AUTHORITY: string;
	readonly VITE_B2C_REDIRECT_URI: string;
	readonly VITE_B2C_SCOPE: string;
	readonly VITE_B2C_ADMIN_CLIENTID: string;
	readonly VITE_B2C_ADMIN_AUTHORITY: string;
	readonly VITE_B2C_ADMIN_REDIRECT_URI: string;
	readonly VITE_B2C_ADMIN_SCOPE: string;
	readonly VITE_FUNCTION_ENDPOINT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
