import { E2EInfrastructure } from '@cellix/serenity-framework/infrastructure/e2e';
import { testApiServer, testAzuriteServer, testMessagingServer, testMongoServer, testOAuth2Server, uiShareThriftPortalServer } from './servers/index.ts';
import { cleanupTestEnvironment, initTestEnvironment } from './shared/environment/test-environment.ts';
import { performOAuth2Login } from './shared/support/oauth2-login.ts';

const runtime = E2EInfrastructure.create({
	browserContextOptions: {
		ignoreHTTPSErrors: true,
		screen: { width: 1440, height: 900 },
		viewport: { width: 1440, height: 900 },
	},
	cleanupEnvironment: cleanupTestEnvironment,
	setupEnvironment: initTestEnvironment,
})
	.addServer('mongo', testMongoServer)
	.addServer('azurite', testAzuriteServer)
	.addServer('auth', testOAuth2Server)
	.addServer('messaging', testMessagingServer)
	.addServer('api', testApiServer, { dependsOn: ['mongo', 'azurite', 'auth', 'messaging'] })
	.addUiPortal('sharethrift', uiShareThriftPortalServer, {
		dependsOn: ['api', 'auth'],
	})
	.finalize();

let authenticated = false;

export const infrastructure = {
	async ensureStarted() {
		await runtime.ensureStarted();
		const browser = runtime.getState().browseTheWeb;
		if (!authenticated && browser) {
			await performOAuth2Login(browser.page);
			authenticated = true;
		}
	},
	getState: () => runtime.getState(),
	resetScenarioState: () => runtime.resetScenarioState(),
	newPortalContext: (name: string) => runtime.newPortalContext(name),
	async stopAll() {
		authenticated = false;
		await runtime.stopAll();
	},
};
