import type { ListingAppealRequestEntityReference } from '../../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';
import type { AppealRequestPassport } from '../../../../contexts/appeal-request/appeal-request.passport.ts';
import type { AppealRequestVisa } from '../../../../contexts/appeal-request/appeal-request.visa.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import { PersonalUserAppealRequestListingAppealRequestVisa } from './personal-user.appeal-request.listing-appeal-request.visa.ts';
import { PersonalUserAppealRequestUserAppealRequestVisa } from './personal-user.appeal-request.user-appeal-request.visa.ts';

export class PersonalUserAppealRequestPassport
	extends PersonalUserPassportBase
	implements AppealRequestPassport
{
	forListingAppealRequest(
		root: ListingAppealRequestEntityReference,
	): AppealRequestVisa {
		return new PersonalUserAppealRequestListingAppealRequestVisa(
			root,
			this._user,
		);
	}

	forUserAppealRequest(
		root: UserAppealRequestEntityReference,
	): AppealRequestVisa {
		return new PersonalUserAppealRequestUserAppealRequestVisa(
			root,
			this._user,
		);
	}
}
