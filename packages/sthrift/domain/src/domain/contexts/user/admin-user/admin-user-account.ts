import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.ts';
import type {
	AdminUserAccountEntityReference,
	AdminUserAccountProps,
} from './admin-user-account.entity.ts';
import { AdminUserProfile } from './admin-user-account-profile.ts';

export class AdminUserAccount
	extends DomainSeedwork.ValueObject<AdminUserAccountProps>
	implements AdminUserAccountEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: AdminUserAggregateRoot;
	constructor(
		props: AdminUserAccountProps,
		visa: UserVisa,
		root: AdminUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
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

	// Primitive Field Getters
	get accountType() {
		return this.props.accountType;
	}
	get email() {
		return this.props.email;
	}
	get username() {
		return this.props.username;
	}

	// NestedPath Field Getters
	get profile() {
		return new AdminUserProfile(this.props.profile, this.visa, this.root);
	}

	set accountType(value: string) {
		this.validateVisa();
		this.props.accountType = value;
	}
	set email(value: string) {
		this.validateVisa();
		this.props.email = value;
	}
	set username(value: string) {
		this.validateVisa();
		this.props.username = value;
	}
}
