import { registerManagedSerenityWorld } from '@cellix/serenity-framework/cucumber';
import { SerenityCast } from '@cellix/serenity-framework/serenity';
import { registerLifecycleHooks } from './cucumber-lifecycle-hooks.ts';
import { infrastructure } from './infrastructure.ts';

export const ShareThriftWorld = registerManagedSerenityWorld({
	infrastructure,
	validateState: (state) => {
		if (!state.browseTheWeb) throw new Error('BrowseTheWeb ability not initialized');
	},
	createCast: (state) =>
		new SerenityCast({
			useNotepad: true,
			abilities: [
				() => {
					if (!state.browseTheWeb) throw new Error('BrowseTheWeb ability not initialized');
					return state.browseTheWeb;
				},
			],
		}),
});

export type ShareThriftWorld = InstanceType<typeof ShareThriftWorld>;
registerLifecycleHooks();
