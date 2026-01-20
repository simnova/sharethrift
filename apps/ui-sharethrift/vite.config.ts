import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Check if certificates exist (local dev only)
const certKeyPath = path.resolve(__dirname, '../../.certs/sharethrift.localhost-key.pem');
const certPath = path.resolve(__dirname, '../../.certs/sharethrift.localhost.pem');
const hasCerts = fs.existsSync(certKeyPath) && fs.existsSync(certPath);

// https://vite.dev/config/
export default defineConfig(() => {
	const isDev = process.env.NODE_ENV === 'development';
	return {
		plugins: [react()],
		server: isDev
			? {
					port: 3000,
					host: '0.0.0.0',
					...(hasCerts && {
						https: {
							key: fs.readFileSync(certKeyPath),
							cert: fs.readFileSync(certPath),
						},
					}),
					open: hasCerts ? 'https://sharethrift.localhost:3000' : 'http://localhost:3000',
				}
			: {
					port: 3000,
					open: true,
				},
	};
});
