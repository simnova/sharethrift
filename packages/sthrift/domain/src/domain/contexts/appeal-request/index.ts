export * as ListingAppealRequest from './listing-appeal-request/index.ts';
export * as UserAppealRequest from './user-appeal-request/index.ts';

// AppealRequest union type - accepts either UserAppealRequest or ListingAppealRequest
import type { UserAppealRequestEntityReference } from './user-appeal-request/user-appeal-request.entity.ts';
import type { ListingAppealRequestEntityReference } from './listing-appeal-request/listing-appeal-request.entity.ts';

export type AppealRequestEntityReference =
	| UserAppealRequestEntityReference
	| ListingAppealRequestEntityReference;
