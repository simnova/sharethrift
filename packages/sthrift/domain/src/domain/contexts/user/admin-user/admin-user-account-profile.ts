import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.aggregate.ts';
import type {
	AdminUserProfileEntityReference,
	AdminUserProfileProps,
} from './admin-user-account-profile.entity.ts';
import { AdminUserAccountProfileLocation } from './admin-user-account-profile-location.ts';
import { createValidatedStringAccessors } from './admin-user.helpers.ts';

export class AdminUserProfile
	extends DomainSeedwork.ValueObject<AdminUserProfileProps>
	implements AdminUserProfileEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: AdminUserAggregateRoot;
	firstName!: string;
	lastName!: string;
	aboutMe!: string;

	constructor(
		props: AdminUserProfileProps,
		visa: UserVisa,
		root: AdminUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
		createValidatedStringAccessors(this, () => this.validateVisa(), [
			'firstName',
			'lastName',
			'aboutMe',
		]);
	}

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to set account profile details',
			);
		}
	}

	get location() {
		return new AdminUserAccountProfileLocation(
			this.props.location,
			this.visa,
			this.root,
		);
	}
}
