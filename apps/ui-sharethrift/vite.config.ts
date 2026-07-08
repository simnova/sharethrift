import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		plugins: [react()],
		server: {
			port: Number(process.env.PORT) || undefined,
			// Skip auto-opening a browser under E2E, where a headless Playwright
			// browser drives the app and a real window must not be spawned.
			open: process.env.E2E === 'true' ? false : 'https://sharethrift.localhost:1355',
		},
	};
});
