import { type Browser, type BrowserContext, chromium } from '@playwright/test';
import { BrowseTheWeb } from '../abilities/browse-the-web.ts';
import { performOAuth2Login } from './oauth2-login.ts';
import {
	cleanupTestEnvironment,
	initTestEnvironment,
	MongoDBTestServer,
	setMongoConnectionString,
	TestApiServer,
	TestOAuth2Server,
	TestViteServer,
} from './servers/index.ts';

const isDeployedE2E = process.env['E2E_DEPLOYED'] === 'true';
const deployedApiUrl = process.env['E2E_API_URL'];
const deployedUiUrl = process.env['E2E_UI_URL'];
const deployedIgnoreHttpsErrors =
	process.env['E2E_IGNORE_HTTPS_ERRORS'] === 'true';
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
	if (browser) {
		await browser.close().catch(() => undefined);
		browser = undefined;
	}
	if (viteServer) {
		await viteServer.stop().catch(() => undefined);
		viteServer = undefined;
	}
	if (apiServer) {
		await apiServer.stop().catch(() => undefined);
		apiServer = undefined;
	}
	if (oauth2Server) {
		await oauth2Server.stop().catch(() => undefined);
		oauth2Server = undefined;
	}
	if (mongoDBServer) {
		await mongoDBServer.stop().catch(() => undefined);
		mongoDBServer = undefined;
	}
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
	initTestEnvironment();

	try {
		// Phase 1: Start MongoDB and OAuth2 in parallel (no interdependency)
		mongoDBServer ??= new MongoDBTestServer();
		oauth2Server ??= new TestOAuth2Server();
		const mongo = mongoDBServer;
		const oauth2 = oauth2Server;
		const phase1: Promise<void>[] = [];
		if (!mongo.isRunning()) {
			phase1.push(
				mongo.start().then(() => {
					setMongoConnectionString(mongo.getConnectionString());
				}),
			);
		}
		if (!oauth2.isRunning()) {
			phase1.push(oauth2.start());
		}
		await waitForStartupPhase(phase1);

		// Phase 2: Start API (needs MongoDB conn string) and Vite in parallel.
		// The browser login flow below is the source of truth for authentication,
		// so local E2E does not need a pre-minted access token here.
		apiServer ??= new TestApiServer();
		viteServer ??= new TestViteServer();
		const api = apiServer;
		const vite = viteServer;
		const phase2: Promise<void>[] = [];
		if (!api.isRunning()) {
			phase2.push(
				api.start().then(() => {
					apiUrl = api.getUrl();
				}),
			);
		}
		if (!vite.isRunning()) {
			phase2.push(vite.start());
		}
		await waitForStartupPhase(phase2);

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
	} catch (error) {
		await stopAll();
		throw error;
	}
}

async function initDeployedE2E(): Promise<void> {
	if (!deployedApiUrl)
		throw new Error('E2E_API_URL is required when E2E_DEPLOYED=true');
	if (!deployedUiUrl)
		throw new Error('E2E_UI_URL is required when E2E_DEPLOYED=true');

	apiUrl = deployedApiUrl;
	browserBaseUrl = deployedUiUrl;
	accessToken = process.env['E2E_ACCESS_TOKEN'] ?? undefined;

	if (!browser) {
		browser = await chromium.launch({
			headless: true,
			args: ['--headless=new'],
		});
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

async function waitForStartupPhase(tasks: Promise<void>[]): Promise<void> {
	if (tasks.length === 0) {
		return;
	}

	const results = await Promise.allSettled(tasks);
	const failure = results.find(
		(result): result is PromiseRejectedResult => result.status === 'rejected',
	);
	if (failure) {
		throw failure.reason;
	}
}
