import { type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
import { BrowseTheWeb } from '../abilities/browse-the-web.ts';
import { listingAbilities } from '../../contexts/listing/abilities/index.ts';
import { GraphQLListingSession } from '../../contexts/listing/abilities/graphql-listing-session.ts';
import { MongoListingSession } from '../../contexts/listing/abilities/mongo-listing-session.ts';
import { reservationRequestAbilities } from '../../contexts/reservation-request/abilities/index.ts';
import { GraphQLReservationRequestSession } from '../../contexts/reservation-request/abilities/graphql-reservation-request-session.ts';
import { MongoReservationRequestSession } from '../../contexts/reservation-request/abilities/mongo-reservation-request-session.ts';
import { MultiContextSession } from '../abilities/multi-context-session.ts';
import type { TaskLevel, SessionType } from '../../world.ts';

export class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: TaskLevel,
		private readonly sessionType: SessionType,
		private readonly apiUrl: string,
		private readonly browseTheWeb?: BrowseTheWeb,
		private readonly authToken?: string,
	) {}

	private createMultiContextSession(): MultiContextSession {
		const multiSession = new MultiContextSession();

		if (this.sessionType === 'mongodb') {
			multiSession.registerSession('listing', new MongoListingSession(this.apiUrl, this.authToken));
			multiSession.registerSession('reservation', new MongoReservationRequestSession(this.apiUrl, this.authToken));
		} else {
			multiSession.registerSession('listing', new GraphQLListingSession(this.apiUrl, this.authToken));
			multiSession.registerSession('reservation', new GraphQLReservationRequestSession(this.apiUrl, this.authToken));
		}

		return multiSession;
	}

	prepare(actor: Actor): Actor {
		if (this.tasksLevel === 'domain') {
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				...listingAbilities.create(),
				...reservationRequestAbilities.create(),
			);
		}

		if (this.tasksLevel === 'e2e') {
			if (!this.browseTheWeb) {
				throw new Error('E2E tests require a browser');
			}
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				this.browseTheWeb,
				this.createMultiContextSession(),
			);
		}

		return actor.whoCan(
			TakeNotes.using(Notepad.empty()),
			this.createMultiContextSession(),
		);
	}
}
