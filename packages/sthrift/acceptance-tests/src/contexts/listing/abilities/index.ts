import { CreateListingAbility } from './create-listing-ability.ts';

// Factory: creates fresh ability instances per scenario to prevent state leakage
export const listingAbilities = {
	create: () => [CreateListingAbility.using()],
};
