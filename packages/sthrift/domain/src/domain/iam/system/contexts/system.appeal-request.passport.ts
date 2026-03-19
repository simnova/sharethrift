import type { ListingAppealRequestEntityReference } from '../../../contexts/appeal-request/listing-appeal-request/listing-appeal-request.entity.ts';
import type { UserAppealRequestEntityReference } from '../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';
import type { AppealRequestPassport } from '../../../contexts/appeal-request/appeal-request.passport.ts';
import type { AppealRequestVisa } from '../../../contexts/appeal-request/appeal-request.visa.ts';
import type { AppealRequestDomainPermissions } from '../../../contexts/appeal-request/appeal-request.domain-permissions.ts';
import { SystemPassportBase } from '../system.passport-base.ts';

export class SystemAppealRequestPassport
	extends SystemPassportBase
	implements AppealRequestPassport
{
	forListingAppealRequest(
		_root: ListingAppealRequestEntityReference,
	): AppealRequestVisa {
		const permissions = this.permissions as AppealRequestDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}

	forUserAppealRequest(
		_root: UserAppealRequestEntityReference,
	): AppealRequestVisa {
		const permissions = this.permissions as AppealRequestDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
