import { type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import type { BrowseTheWeb } from '../abilities/browse-the-web.ts';

export class ShareThriftCast implements Cast {
	constructor(
		private readonly apiUrl: string,
		private readonly browseTheWeb?: BrowseTheWeb,
		private readonly authToken?: string,
	) {}

	prepare(actor: Actor): Actor {
		if (!this.browseTheWeb) {
			throw new Error('E2E tests require a browser');
		}
		return actor.whoCan(
			TakeNotes.using(Notepad.empty()),
			this.browseTheWeb,
		);
	}
}
