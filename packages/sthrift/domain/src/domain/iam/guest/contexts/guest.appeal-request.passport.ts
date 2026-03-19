import type { ListingAppealRequestEntityReference } from '../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';
import type { AppealRequestPassport } from '../../../contexts/appeal-request/appeal-request.passport.ts';
import type { AppealRequestVisa } from '../../../contexts/appeal-request/appeal-request.visa.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestAppealRequestPassport
	extends GuestPassportBase
	implements AppealRequestPassport
{
	forListingAppealRequest(
		_root: ListingAppealRequestEntityReference,
	): AppealRequestVisa {
		return { determineIf: () => false };
	}

	forUserAppealRequest(
		_root: UserAppealRequestEntityReference,
	): AppealRequestVisa {
		return { determineIf: () => false };
	}
}
