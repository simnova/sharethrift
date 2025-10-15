import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.ts';
import type {
	AdminUserAccountEntityReference,
	AdminUserAccountProps,
} from './admin-user-account.entity.ts';

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

	// Getters
	get accountType() {
		return this.props.accountType;
	}
	get email() {
		return this.props.email;
	}
	get username() {
		return this.props.username;
	}
	get firstName() {
		return this.props.firstName;
	}
	get lastName() {
		return this.props.lastName;
	}

	// Setters
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
	set firstName(value: string) {
		this.validateVisa();
		this.props.firstName = value;
	}
	set lastName(value: string) {
		this.validateVisa();
		this.props.lastName = value;
	}
}
