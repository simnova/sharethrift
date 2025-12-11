import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		open: true, // Automatically open browser on server start
    watch: { usePolling: false }, // attempt to fix issue on pipeline: [vite] (client) Pre-transform error: EMFILE: too many open files, open '/home/vsts/work/1/s/packages/sthrift/ui-components/dist/src/index.js'
	},
});
