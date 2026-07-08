import { registerManagedSerenityWorld } from '@cellix/serenity-framework/cucumber';
import { RenderInDom } from '@cellix/serenity-framework/dom/render-in-dom';
import { SerenityCast } from '@cellix/serenity-framework/serenity';
import { listingAbilities } from './contexts/listing/abilities/index.ts';
import { reservationRequestAbilities } from './contexts/reservation-request/abilities/index.ts';
import { registerLifecycleHooks } from './cucumber-lifecycle-hooks.ts';
import { infrastructure } from './infrastructure.ts';

export const ShareThriftUiWorld = registerManagedSerenityWorld({
	infrastructure,
	createCast: () =>
		new SerenityCast({
			useNotepad: true,
			abilities: [() => new RenderInDom(), ...listingAbilities.create().map((ability) => () => ability), ...reservationRequestAbilities.create().map((ability) => () => ability)],
		}),
});

export type ShareThriftUiWorld = InstanceType<typeof ShareThriftUiWorld>;
export { ShareThriftUiWorld as ShareThriftWorld };
registerLifecycleHooks();
