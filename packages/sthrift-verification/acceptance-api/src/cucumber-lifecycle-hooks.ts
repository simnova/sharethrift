import { registerWorldLifecycleHooks } from '@cellix/serenity-framework/cucumber';
import { getTimeout } from '@cellix/serenity-framework/settings';
import type { IWorld } from '@cucumber/cucumber';
import { infrastructure } from './infrastructure.ts';
import type { ShareThriftApiWorld } from './world.ts';

export function registerLifecycleHooks(): void {
	registerWorldLifecycleHooks<IWorld & ShareThriftApiWorld>({
		scenarioTimeout: getTimeout('scenario'),
		before: (world) => world.init(),
		after: (world) => world.cleanup(),
		afterAll: () => infrastructure.stopAll(),
	});
}
