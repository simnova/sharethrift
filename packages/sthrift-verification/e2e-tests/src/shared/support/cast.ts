import { type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import { BrowseTheWeb } from '../abilities/browse-the-web.ts';
import { GraphQLListingSession } from '../../contexts/listing/abilities/graphql-listing-session.ts';
import { GraphQLReservationRequestSession } from '../../contexts/reservation-request/abilities/graphql-reservation-request-session.ts';
import { MultiContextSession } from '../abilities/multi-context-session.ts';

export class ShareThriftCast implements Cast {
	constructor(
		private readonly apiUrl: string,
		private readonly browseTheWeb?: BrowseTheWeb,
		private readonly authToken?: string,
	) {}

	private createMultiContextSession(): MultiContextSession {
		const multiSession = new MultiContextSession();
		multiSession.registerSession('listing', new GraphQLListingSession(this.apiUrl, this.authToken));
		multiSession.registerSession('reservation', new GraphQLReservationRequestSession(this.apiUrl, this.authToken));
		return multiSession;
	}

	prepare(actor: Actor): Actor {
		if (!this.browseTheWeb) {
			throw new Error('E2E tests require a browser');
		}
		return actor.whoCan(
			TakeNotes.using(Notepad.empty()),
			this.browseTheWeb,
			this.createMultiContextSession(),
		);
	}
}
