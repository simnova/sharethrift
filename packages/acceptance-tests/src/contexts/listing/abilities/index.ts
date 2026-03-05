import { CreateListingAbility } from './create-listing-ability.js';

/**
 * Creates all abilities for the listing context at domain level.
 */
export function createListingAbilities() {
	return CreateListingAbility.using({} as unknown, {} as unknown, {} as unknown);
}
