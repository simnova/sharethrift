import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.aggregate.ts';
import type {
	AdminUserAccountEntityReference,
	AdminUserAccountProps,
} from './admin-user-account.entity.ts';
import { AdminUserProfile } from './admin-user-account-profile.ts';
import { createValidatedStringAccessors } from './admin-user.helpers.ts';

export class AdminUserAccount
	extends DomainSeedwork.ValueObject<AdminUserAccountProps>
	implements AdminUserAccountEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: AdminUserAggregateRoot;
	accountType!: string;
	email!: string;
	username!: string;

	constructor(
		props: AdminUserAccountProps,
		visa: UserVisa,
		root: AdminUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
		createValidatedStringAccessors(this, () => this.validateVisa(), [
			'accountType',
			'email',
			'username',
		]);
	}

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to set account details',
			);
		}
	}

	get profile() {
		return new AdminUserProfile(this.props.profile, this.visa, this.root);
	}
}
