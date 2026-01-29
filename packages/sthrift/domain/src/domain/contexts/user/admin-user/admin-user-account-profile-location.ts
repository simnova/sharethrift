import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.aggregate.ts';
import type {
	AdminUserAccountProfileLocationEntityReference,
	AdminUserAccountProfileLocationProps,
} from './admin-user-account-profile-location.entity.ts';
import { createValidatedStringAccessors } from './admin-user.helpers.ts';

export class AdminUserAccountProfileLocation
	extends DomainSeedwork.ValueObject<AdminUserAccountProfileLocationProps>
	implements AdminUserAccountProfileLocationEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: AdminUserAggregateRoot;
	address1!: string;
	address2!: string | null;
	city!: string;
	state!: string;
	country!: string;
	zipCode!: string;

	constructor(
		props: AdminUserAccountProfileLocationProps,
		visa: UserVisa,
		root: AdminUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
		createValidatedStringAccessors(this, () => this.validateVisa(), [
			'address1',
			'address2',
			'city',
			'state',
			'country',
			'zipCode',
		]);
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
}
