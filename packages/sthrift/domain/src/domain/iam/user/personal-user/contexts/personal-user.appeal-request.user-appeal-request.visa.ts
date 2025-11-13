import type { UserAppealRequestEntityReference } from '../../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';
import type { AppealRequestDomainPermissions } from '../../../../contexts/appeal-request/appeal-request.domain-permissions.ts';
import type { AppealRequestVisa } from '../../../../contexts/appeal-request/appeal-request.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';

export class PersonalUserAppealRequestUserAppealRequestVisa<
	root extends UserAppealRequestEntityReference,
> implements AppealRequestVisa
{
	private readonly root: root;
	private readonly user: PersonalUserEntityReference;
	constructor(root: root, user: PersonalUserEntityReference) {
		this.root = root;
		this.user = user;
	}

	determineIf(
		func: (permissions: Readonly<AppealRequestDomainPermissions>) => boolean,
	): boolean {
		const updatedPermissions: AppealRequestDomainPermissions = {
			canCreateAppealRequest: this.user.isBlocked === false,
			canUpdateAppealRequestState: this.user.id === this.root.user.id,
			canViewAppealRequest: this.user.id === this.root.user.id,
			canViewAllAppealRequests: false,
		};

		return func(updatedPermissions);
	}
}
