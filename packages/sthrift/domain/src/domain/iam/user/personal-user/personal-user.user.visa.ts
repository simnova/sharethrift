import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/personal-user.entity.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
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
		const updatedPermissions: UserDomainPermissions = {
			canCreateUser: false,
			canBlockUsers: false,
			canBlockListings: false,
			canUnblockUsers: false,
			canUnblockListings: false,
			canRemoveListings: false,
			canViewListingReports: false,
			canViewUserReports: false,

			isEditingOwnAccount: this.user.id === this.root.id,
			isSystemAccount: false,
		};

		return func(updatedPermissions);
	}
}
