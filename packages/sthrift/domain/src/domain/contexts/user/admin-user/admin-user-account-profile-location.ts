import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.ts';
import type {
	AdminUserAccountProfileLocationEntityReference,
	AdminUserAccountProfileLocationProps,
} from './admin-user-account-profile-location.entity.ts';

export class AdminUserAccountProfileLocation
	extends DomainSeedwork.ValueObject<AdminUserAccountProfileLocationProps>
	implements AdminUserAccountProfileLocationEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: AdminUserAggregateRoot;
	constructor(
		props: AdminUserAccountProfileLocationProps,
		visa: UserVisa,
		root: AdminUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
	}
	// Primitive Field Getters
	get address1() {
		return this.props.address1;
	}
	get address2(): string | null {
		return this.props.address2;
	}
	get city() {
		return this.props.city;
	}
	get state() {
		return this.props.state;
	}
	get country() {
		return this.props.country;
	}
	get zipCode() {
		return this.props.zipCode;
	}

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to set location info',
			);
		}
	}

	// Primitive Field Setters
	set address1(value: string) {
		this.validateVisa();
		this.props.address1 = value;
	}
	set address2(value: string | null) {
		this.validateVisa();
		this.props.address2 = value;
	}
	set city(value: string) {
		this.validateVisa();
		this.props.city = value;
	}
	set state(value: string) {
		this.validateVisa();
		this.props.state = value;
	}
	set country(value: string) {
		this.validateVisa();
		this.props.country = value;
	}
	set zipCode(value: string) {
		this.validateVisa();
		this.props.zipCode = value;
	}
}
