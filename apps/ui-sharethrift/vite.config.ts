import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		host: '0.0.0.0', // Listen on all interfaces so sharethrift.localhost works
		https: {
			key: fs.readFileSync(path.resolve(__dirname, '../../.certs/sharethrift.localhost-key.pem')),
			cert: fs.readFileSync(path.resolve(__dirname, '../../.certs/sharethrift.localhost.pem')),
		},
		open: 'https://sharethrift.localhost:3000', // Open the correct URL
	},
});
