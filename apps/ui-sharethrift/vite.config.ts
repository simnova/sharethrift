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
			// Pre-transform the app entry at server startup so the first navigation
			// to a route doesn't stall while Vite compiles the module graph.
			warmup: {
				clientFiles: ['./src/main.tsx'],
			},
		},
		// The UI is composed from linked workspace packages (@sthrift/ui-shared and the
		// route packages) that resolve to source. By default Vite does NOT pre-bundle
		// linked packages, so it serves every one of their hundreds of component files as
		// a separate module request. Behind the portless HTTP/2 proxy, that request storm
		// intermittently fails with net::ERR_HTTP2_PROTOCOL_ERROR, which breaks the render
		// and leaves a ~10-15s white screen until the page reloads.
		//
		// Including these packages forces Vite to pre-bundle each into a single optimized
		// chunk, collapsing hundreds of parallel /@fs/ requests into a handful and removing
		// the HTTP/2 failure mode. The third-party heavy deps are listed too so they are
		// bundled up front rather than discovered on-demand (which triggers a re-optimize
		// + full-page reload).
		//
		// Trade-off: edits to these workspace packages trigger a Vite re-optimize (full
		// reload) instead of granular HMR. If you are actively iterating inside one of
		// them, temporarily remove it from this list.
		optimizeDeps: {
			include: [
				'@sthrift/ui-shared',
				'@sthrift/ui-sharethrift-route-root',
				'@sthrift/ui-sharethrift-route-shared',
				'@sthrift/ui-sharethrift-route-signup',
				'antd',
				'@ant-design/icons',
				'@ant-design/v5-patch-for-react-19',
				'@apollo/client',
				'@apollo/client/react',
				'@apollo/client/link/http',
				'@apollo/client/link/context',
				'@apollo/client/link/batch-http',
				'@apollo/client/link/persisted-queries',
				'graphql',
				'lodash',
				'rxjs',
				'react-oidc-context',
				'react-router-dom',
			],
		},
	};
});
