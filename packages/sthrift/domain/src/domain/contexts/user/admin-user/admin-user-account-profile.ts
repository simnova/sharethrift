import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.ts';
import type {
	AdminUserProfileEntityReference,
	AdminUserProfileProps,
} from './admin-user-account-profile.entity.ts';
import { AdminUserAccountProfileLocation } from './admin-user-account-profile-location.ts';

export class AdminUserProfile
	extends DomainSeedwork.ValueObject<AdminUserProfileProps>
	implements AdminUserProfileEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: AdminUserAggregateRoot;
	constructor(
		props: AdminUserProfileProps,
		visa: UserVisa,
		root: AdminUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
	}
	// Primitive Field Getters
	get firstName() {
		return this.props.firstName;
	}
	get lastName() {
		return this.props.lastName;
	}
	get aboutMe() {
		return this.props.aboutMe;
	}

	// NestedPath Field Getters
	get location() {
		return new AdminUserAccountProfileLocation(
			this.props.location,
			this.visa,
			this.root,
		);
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

	// Primitive Field Setters
	set firstName(value: string) {
		this.validateVisa();
		this.props.firstName = value;
	}
	set lastName(value: string) {
		this.validateVisa();
		this.props.lastName = value;
	}
	set aboutMe(value: string) {
		this.validateVisa();
		this.props.aboutMe = value;
	}
}
