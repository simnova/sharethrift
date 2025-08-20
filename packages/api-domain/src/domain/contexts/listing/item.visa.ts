import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { ItemListingDomainPermissions } from './item.domain-permissions.ts';

export interface ItemListingVisa extends PassportSeedwork.Visa<ItemListingDomainPermissions> {
	determineIf(
		func: (permissions: Readonly<ItemListingDomainPermissions>) => boolean,
	): boolean;
}