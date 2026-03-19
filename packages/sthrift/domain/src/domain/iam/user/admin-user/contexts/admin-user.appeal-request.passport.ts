import type { ListingAppealRequestEntityReference } from '../../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';
import type { AppealRequestPassport } from '../../../../contexts/appeal-request/appeal-request.passport.ts';
import type { AppealRequestVisa } from '../../../../contexts/appeal-request/appeal-request.visa.ts';
import { AdminUserPassportBase } from '../admin-user.passport-base.ts';
import { AdminUserAppealRequestListingAppealRequestVisa } from './admin-user.appeal-request.listing-appeal-request.visa.ts';
import { AdminUserAppealRequestUserAppealRequestVisa } from './admin-user.appeal-request.user-appeal-request.visa.ts';

export class AdminUserAppealRequestPassport
	extends AdminUserPassportBase
	implements AppealRequestPassport
{
	forListingAppealRequest(
		root: ListingAppealRequestEntityReference,
	): AppealRequestVisa {
		return new AdminUserAppealRequestListingAppealRequestVisa(root, this._user);
	}

	forUserAppealRequest(
		root: UserAppealRequestEntityReference,
	): AppealRequestVisa {
		return new AdminUserAppealRequestUserAppealRequestVisa(root, this._user);
	}
}
