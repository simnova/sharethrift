import { apiSettings } from '@sthrift-verification/verification-shared/settings';
import { PortlessServer } from './portless-server.ts';
import { buildUrl, getMongoConnectionString } from './test-environment.ts';

// Azure Functions API via portless
export class TestApiServer extends PortlessServer {
	protected get probeUrl() {
		return buildUrl('data-access.sharethrift.localhost', '/api/graphql');
	}
	protected get readyMarker() {
		return 'Functions:';
	}
	protected get serverName() {
		return 'TestApiServer';
	}
	protected get startupTimeoutMs() {
		return 120_000;
	}
	protected get spawnArgs() {
		return [
			'--force',
			'data-access.sharethrift.localhost',
			'node',
			'start-dev.mjs',
		];
	}
	protected get cwd() {
		return apiSettings.apiDir;
	}
	// GraphQL endpoint returns 400 for GET requests; readyMarker is sufficient.
	protected override get shouldWaitForProbe() {
		return false;
	}

	protected override get extraEnv() {
		const userPortalOauthUrl = buildUrl(
			'mock-auth.sharethrift.localhost',
			'/user-portal',
		);
		const adminPortalOauthUrl = buildUrl(
			'mock-auth.sharethrift.localhost',
			'/admin-portal',
		);
		return {
			languageWorkers__node__arguments: '', // Avoid debug inspector port conflict
			COSMOSDB_CONNECTION_STRING: getMongoConnectionString(),
			USER_PORTAL_OIDC_ISSUER: userPortalOauthUrl,
			USER_PORTAL_OIDC_ENDPOINT: `${userPortalOauthUrl}/.well-known/jwks.json`,
			ADMIN_PORTAL_OIDC_ISSUER: adminPortalOauthUrl,
			ADMIN_PORTAL_OIDC_ENDPOINT: `${adminPortalOauthUrl}/.well-known/jwks.json`,
			VITE_FUNCTION_ENDPOINT: buildUrl(
				'data-access.sharethrift.localhost',
				'/api/graphql',
			),
		};
	}

	getUrl(): string {
		return buildUrl('data-access.sharethrift.localhost', '/api/graphql');
	}
}
