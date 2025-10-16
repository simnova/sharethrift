import { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	AccountPlanFeatureEntityReference,
	AccountPlanFeatureProps,
} from './account-plan-feature.entity.ts';
export class AccountPlanFeature
	extends DomainSeedwork.ValueObject<AccountPlanFeatureProps>
	implements AccountPlanFeatureEntityReference
{
	// private readonly visa: AccountPlanVisa

	// public constructor(props: AccountPlanFeatureProps) {
	// super(props);
	// this.visa = visa;
	// }

	get activeReservations(): number {
		return this.props.activeReservations;
	}
	set activeReservations(value: number) {
		this.props.activeReservations = value;
	}

	get bookmarks(): number {
		return this.props.bookmarks;
	}
	set bookmarks(value: number) {
		this.props.bookmarks = value;
	}

	get itemsToShare(): number {
		return this.props.itemsToShare;
	}
	set itemsToShare(value: number) {
		this.props.itemsToShare = value;
	}

	get friends(): number {
		return this.props.friends;
	}

	set friends(value: number) {
		this.props.friends = value;
	}
}
