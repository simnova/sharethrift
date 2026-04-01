import type { IWorld, ITestCaseHookParameter } from '@cucumber/cucumber';
import { After, AfterAll, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { isAgent } from 'std-env';
import path from 'node:path';
import fs from 'node:fs';

import { type ShareThriftWorld, stopSharedServers } from '../../world.ts';
import { BrowseTheWeb } from '../abilities/browse-the-web.ts';

let lastTestConfig: string | undefined;

setDefaultTimeout(120_000);

Before(async function (this: IWorld<{ tasks?: string }>) {
	const world = this as IWorld<{ tasks?: string }> & ShareThriftWorld;

	const testConfig = 'e2e:browser';

	if (lastTestConfig !== testConfig) {
		lastTestConfig = testConfig;

		if (!isAgent) {
			console.log('\n🌐 E2E tests with BROWSER backend');
			console.log('  • Listing Context');
			console.log('  • Reservation Request Context\n');
		}
	}

	await world.init();
});

After(async function (this: IWorld<{ tasks?: string }>, { result, pickle }: ITestCaseHookParameter) {
	const world = this as IWorld<{ tasks?: string }> & ShareThriftWorld;

	// Capture screenshot on failure for E2E tests
	if (result?.status === Status.FAILED) {
		try {
			const browseTheWeb = BrowseTheWeb.current();
			if (browseTheWeb) {
				const reportsDir = path.resolve(import.meta.dirname, '..', '..', '..', 'reports', 'screenshots');
				fs.mkdirSync(reportsDir, { recursive: true });

				const safeName = pickle.name.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 80);
				const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
				const screenshotPath = path.join(reportsDir, `${safeName}-${timestamp}.png`);

				await browseTheWeb.page.screenshot({ path: screenshotPath, fullPage: true });
				this.attach(fs.readFileSync(screenshotPath), 'image/png');
			}
		} catch {
			// Screenshot capture is best-effort — don't mask the original failure
		}
	}

	await world.cleanup();
});

AfterAll(async function () {
	await stopSharedServers();
});
