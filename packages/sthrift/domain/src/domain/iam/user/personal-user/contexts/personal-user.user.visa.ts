import type { UserDomainPermissions } from '../../../../contexts/user/user.domain-permissions.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { UserVisa } from '../../../../contexts/user/user.visa.ts';
export class PersonalUserUserVisa<root extends PersonalUserEntityReference>
	implements UserVisa
{
	private readonly root: root;
	private readonly user: PersonalUserEntityReference;
	constructor(root: root, user: PersonalUserEntityReference) {
		this.root = root;
		this.user = user;
	}

	determineIf(
		func: (permissions: Readonly<UserDomainPermissions>) => boolean,
	): boolean {
		// const { userPermissions } = this.user.role.permissions; //temporary commented out for role is not populated issue

		const updatedPermissions: UserDomainPermissions = {
			// canCreateUser: userPermissions.canCreateUser,
			// canBlockUsers: userPermissions.canBlockUsers,
			// canUnblockUsers: userPermissions.canUnblockUsers,

			canCreateUser: false,
			canBlockUsers: false,
			canUnblockUsers: false,

			isEditingOwnAccount: this.user.id === this.root.id,
			isSystemAccount: false,
		};

		return func(updatedPermissions);
	}
}
