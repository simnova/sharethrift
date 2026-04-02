import { type Actor, type Cast, Notepad, TakeNotes } from '@serenity-js/core';
import { listingAbilities } from '../../contexts/listing/abilities/index.ts';
import { reservationRequestAbilities } from '../../contexts/reservation-request/abilities/index.ts';
import type { TaskLevel } from '../../world.ts';
import { GraphQLClient } from '../abilities/graphql-client.ts';

export class ShareThriftCast implements Cast {
	constructor(
		private readonly tasksLevel: TaskLevel,
		private readonly apiUrl: string,
	) {}

	prepare(actor: Actor): Actor {
		if (this.tasksLevel === 'ui') {
			return actor.whoCan(
				TakeNotes.using(Notepad.empty()),
				...listingAbilities.create(),
				...reservationRequestAbilities.create(),
			);
		}

		// api level: full stack via GraphQL → app-services → domain → persistence (MongoDB)
		return actor.whoCan(
			TakeNotes.using(Notepad.empty()),
			GraphQLClient.at(this.apiUrl),
		);
	}
}
