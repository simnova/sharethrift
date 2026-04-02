import { type Cast, type Actor, TakeNotes, Notepad } from '@serenity-js/core';
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
	) {}

	private createMultiContextSession(): MultiContextSession {
		const multiSession = new MultiContextSession();

		if (this.sessionType === 'mongodb') {
			multiSession.registerSession('listing', new MongoListingSession(this.apiUrl));
			multiSession.registerSession('reservation', new MongoReservationRequestSession(this.apiUrl));
		} else {
			multiSession.registerSession('listing', new GraphQLListingSession(this.apiUrl));
			multiSession.registerSession('reservation', new GraphQLReservationRequestSession(this.apiUrl));
		}

		return multiSession;
	}

	prepare(actor: Actor): Actor {
		if (this.tasksLevel === 'domain' || this.tasksLevel === 'ui') {
			// UI tests use domain abilities for setup steps (e.g., "has created a listing")
			// and store results in notes; UI rendering happens in UI-specific tasks
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				...listingAbilities.create(),
				...reservationRequestAbilities.create(),
			);
		}

		return actor.whoCan(
			TakeNotes.using(Notepad.empty()),
			this.createMultiContextSession(),
		);
	}
}
