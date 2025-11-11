import type { UserAppealRequestEntityReference } from '../../../../contexts/appeal-request/user-appeal-request/user-appeal-request.entity.ts';
import type { AppealRequestDomainPermissions } from '../../../../contexts/appeal-request/appeal-request.domain-permissions.ts';
import type { AppealRequestVisa } from '../../../../contexts/appeal-request/appeal-request.visa.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';

export class AdminUserAppealRequestUserAppealRequestVisa<
	root extends UserAppealRequestEntityReference,
> implements AppealRequestVisa
{
	private readonly root: root;
	private readonly user: AdminUserEntityReference;
	constructor(root: root, user: AdminUserEntityReference) {
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
