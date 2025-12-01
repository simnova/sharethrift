import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AccountPlanFeatureProps
	extends DomainSeedwork.ValueObjectProps {
	activeReservations: number;
	bookmarks: number;
	itemsToShare: number;
	friends: number;
}

export interface AccountPlanFeatureEntityReference
	extends Readonly<AccountPlanFeatureProps> {}
