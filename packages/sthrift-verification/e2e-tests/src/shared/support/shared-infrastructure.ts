import { chromium, type Browser, type BrowserContext } from '@playwright/test';
import { BrowseTheWeb } from '../abilities/browse-the-web.ts';
import { MongoDBTestServer, TestOAuth2Server, TestViteServer, TestApiServer, initTestEnvironment, cleanupTestEnvironment, setMongoConnectionString } from './servers/index.ts';
import { defaultActor } from '@sthrift-verification/test-support/test-data';
import { performOAuth2Login } from './oauth2-login.ts';
import { apiSettings } from './local-settings.ts';

const isDeployedE2E = process.env['E2E_DEPLOYED'] === 'true';
const deployedApiUrl = process.env['E2E_API_URL'];
const deployedUiUrl = process.env['E2E_UI_URL'];
const deployedIgnoreHttpsErrors = process.env['E2E_IGNORE_HTTPS_ERRORS'] === 'true';
const skipDeployedUiLogin = process.env['E2E_SKIP_UI_LOGIN'] === 'true';

// Shared infrastructure — persists across scenarios within a single test run
let mongoDBServer: MongoDBTestServer | undefined;
let oauth2Server: TestOAuth2Server | undefined;
let apiServer: TestApiServer | undefined;
let viteServer: TestViteServer | undefined;
let apiUrl: string | undefined;
let accessToken: string | undefined;
let browser: Browser | undefined;
let browserBaseUrl: string | undefined;
let authenticatedBrowserContext: BrowserContext | undefined;
let browseTheWeb: BrowseTheWeb | undefined;

export interface InfrastructureState {
	apiUrl: string | undefined;
	accessToken: string | undefined;
	browseTheWeb: BrowseTheWeb | undefined;
}

export function getState(): InfrastructureState {
	return { apiUrl, accessToken, browseTheWeb };
}

export async function stopAll(): Promise<void> {
	if (browseTheWeb) {
		await browseTheWeb.close();
		browseTheWeb = undefined;
	} else if (authenticatedBrowserContext) {
		await authenticatedBrowserContext.close();
	}
	authenticatedBrowserContext = undefined;
	if (browser) { await browser.close(); browser = undefined; }
	if (viteServer) { await viteServer.stop(); viteServer = undefined; }
	if (apiServer) { await apiServer.stop(); apiServer = undefined; }
	if (oauth2Server) { await oauth2Server.stop(); oauth2Server = undefined; }
	if (mongoDBServer) { await mongoDBServer.stop(); mongoDBServer = undefined; }
	apiUrl = undefined;
	browserBaseUrl = undefined;
	accessToken = undefined;
	cleanupTestEnvironment();
}

export async function ensureE2EServers(): Promise<void> {
	if (isDeployedE2E) {
		await initDeployedE2E();
	} else {
		await initLocalE2E();
	}
}

async function initLocalE2E(): Promise<void> {
	await initTestEnvironment();

	if (!mongoDBServer) {
		mongoDBServer = new MongoDBTestServer();
		await mongoDBServer.start();
		setMongoConnectionString(mongoDBServer.getConnectionString());
	}

	if (!oauth2Server) {
		oauth2Server = new TestOAuth2Server({
			testUser: {
				email: defaultActor.email,
				given_name: defaultActor.givenName,
				family_name: defaultActor.familyName,
			},
		});
		await oauth2Server.start();
	}

	if (!apiServer) {
		apiServer = new TestApiServer();
		await apiServer.start();
		apiUrl = apiServer.getUrl();
	}

	if (!accessToken) {
		accessToken = await oauth2Server.generateAccessToken(apiSettings.userPortalOidcAudience);
	}

	if (!viteServer) {
		viteServer = new TestViteServer();
		await viteServer.start();
	}
	browserBaseUrl = viteServer.getUrl();

	if (!apiUrl) {
		apiUrl = apiServer?.getUrl();
	}

	if (!browser) {
		browser = await chromium.launch({ headless: true });
	}

	await ensureAuthenticatedBrowserContext({
		baseURL: browserBaseUrl,
		ignoreHTTPSErrors: true,
		performLogin: true,
	});
}

async function initDeployedE2E(): Promise<void> {
	if (!deployedApiUrl) throw new Error('E2E_API_URL is required when E2E_DEPLOYED=true');
	if (!deployedUiUrl) throw new Error('E2E_UI_URL is required when E2E_DEPLOYED=true');

	apiUrl = deployedApiUrl;
	browserBaseUrl = deployedUiUrl;
	accessToken = process.env['E2E_ACCESS_TOKEN'] ?? undefined;

	if (!browser) {
		browser = await chromium.launch({ headless: true, args: ['--headless=new'] });
	}

	await ensureAuthenticatedBrowserContext({
		baseURL: browserBaseUrl,
		ignoreHTTPSErrors: deployedIgnoreHttpsErrors,
		performLogin: !skipDeployedUiLogin,
	});
}

async function ensureAuthenticatedBrowserContext(options: {
	baseURL?: string;
	ignoreHTTPSErrors: boolean;
	performLogin: boolean;
}): Promise<void> {
	if (browseTheWeb || !browser || !options.baseURL) {
		return;
	}

	if (!authenticatedBrowserContext) {
		authenticatedBrowserContext = await browser.newContext({
			baseURL: options.baseURL,
			ignoreHTTPSErrors: options.ignoreHTTPSErrors,
		});
	}

	const seedPage = await authenticatedBrowserContext.newPage();

	try {
		if (options.performLogin) {
			await performOAuth2Login(seedPage);
		}
		browseTheWeb = BrowseTheWeb.using(seedPage, authenticatedBrowserContext);
	} catch (error) {
		await authenticatedBrowserContext.close().catch(() => undefined);
		authenticatedBrowserContext = undefined;
		throw error;
	}
}
