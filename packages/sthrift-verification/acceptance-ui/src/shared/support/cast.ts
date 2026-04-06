import { type Actor, type Cast, Notepad, TakeNotes } from '@serenity-js/core';
import { listingAbilities } from '../../contexts/listing/abilities/index.ts';
import { reservationRequestAbilities } from '../../contexts/reservation-request/abilities/index.ts';

export class ShareThriftUiCast implements Cast {
	prepare(actor: Actor): Actor {
		return actor.whoCan(
			TakeNotes.using(Notepad.empty()),
			...listingAbilities.create(),
			...reservationRequestAbilities.create(),
		);
	}
}
