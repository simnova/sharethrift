import type { UserDomainPermissions } from '../../contexts/user/user.domain-permissions.ts';
import type { PersonalUserEntityReference } from '../../contexts/user/personal-user/personal-user.entity.ts';
import type { UserVisa } from '../../contexts/user/user.visa.ts';
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
			canBlockUsers: true, // TODO: Replace with proper admin role check
			canBlockListings: true, // TODO: Replace with proper admin role check
			canUnblockUsers: true, // TODO: Replace with proper admin role check
			canUnblockListings: true, // TODO: Replace with proper admin role check
			canRemoveListings: true, // TODO: Replace with proper admin role check
			canViewListingReports: true, // TODO: Replace with proper admin role check
			canViewUserReports: true, // TODO: Replace with proper admin role check

			isEditingOwnAccount: 'id' in this.user && 'id' in this.root ? (this.user as {id: string}).id === (this.root as {id: string}).id : false,
			isSystemAccount: false,
		};

		return func(updatedPermissions);
	}
}
