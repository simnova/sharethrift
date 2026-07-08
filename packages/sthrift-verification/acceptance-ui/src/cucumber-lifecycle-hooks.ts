import { registerWorldLifecycleHooks } from '@cellix/serenity-framework/cucumber';
import { getTimeout } from '@cellix/serenity-framework/settings';
import type { IWorld } from '@cucumber/cucumber';
import type { ShareThriftUiWorld } from './world.ts';

export function registerLifecycleHooks(): void {
	registerWorldLifecycleHooks<IWorld & ShareThriftUiWorld>({
		scenarioTimeout: getTimeout('scenario'),
		before: (world) => world.init(),
		after: (world) => world.cleanup(),
	});
}
