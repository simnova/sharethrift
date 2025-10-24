import { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	AccountPlanFeatureEntityReference,
	AccountPlanFeatureProps,
} from './account-plan-feature.entity.ts';
import type { AccountPlanVisa } from '../account-plan.visa.ts';
export class AccountPlanFeature
	extends DomainSeedwork.ValueObject<AccountPlanFeatureProps>
	implements AccountPlanFeatureEntityReference
{
	private readonly visa: AccountPlanVisa;

	public constructor(props: AccountPlanFeatureProps, visa: AccountPlanVisa) {
		super(props);
		this.visa = visa;
	}

	private validateVisa(): void {
		if (
			!this.visa.determineIf(
				(permissions) =>
					permissions.canCreateAccountPlan || permissions.canUpdateAccountPlan,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to access account plan features',
			);
		}
	}

	get activeReservations(): number {
		return this.props.activeReservations;
	}
	set activeReservations(value: number) {
		this.validateVisa();
		this.props.activeReservations = value;
	}

	get bookmarks(): number {
		return this.props.bookmarks;
	}
	set bookmarks(value: number) {
		this.validateVisa();
		this.props.bookmarks = value;
	}

	get itemsToShare(): number {
		return this.props.itemsToShare;
	}
	set itemsToShare(value: number) {
		this.validateVisa();
		this.props.itemsToShare = value;
	}

	get friends(): number {
		return this.props.friends;
	}

	set friends(value: number) {
		this.validateVisa();
		this.props.friends = value;
	}
}
