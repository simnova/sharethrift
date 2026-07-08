import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerWorldLifecycleHooks } from '@cellix/serenity-framework/cucumber';
import { registerScreenshotOnFailureHook } from '@cellix/serenity-framework/cucumber/screenshot';
import { getTimeout } from '@cellix/serenity-framework/settings';
import type { IWorld } from '@cucumber/cucumber';
import { infrastructure } from './infrastructure.ts';
import type { ShareThriftWorld } from './world.ts';

export function registerLifecycleHooks(): void {
	registerWorldLifecycleHooks<IWorld & ShareThriftWorld>({
		scenarioTimeout: getTimeout('scenario'),
		before: (world) => world.init(),
		after: (world) => world.cleanup(),
		afterAll: () => infrastructure.stopAll(),
	});
	registerScreenshotOnFailureHook({
		reportsDir: path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'reports', 'screenshots'),
	});
}
