import type { AppealRequestVisa } from './appeal-request.visa.ts';
import type { ListingAppealRequestEntityReference } from './listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from './user-appeal-request/user-appeal-request.entity.ts';

export interface AppealRequestPassport {
	forListingAppealRequest(
		root: ListingAppealRequestEntityReference,
	): AppealRequestVisa;
	forUserAppealRequest(
		root: UserAppealRequestEntityReference,
	): AppealRequestVisa;
}
