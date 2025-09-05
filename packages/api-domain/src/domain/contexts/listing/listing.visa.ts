import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { ListingDomainPermissions } from './listing.domain-permissions.ts';

export interface ListingVisa
	extends PassportSeedwork.Visa<ListingDomainPermissions> {
	determineIf(
		func: (permissions: Readonly<ListingDomainPermissions>) => boolean,
	): boolean;
}
