import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { ListingRequestDomainPermissions } from './request.domain-permissions.ts';

export interface ListingRequestVisa extends PassportSeedwork.Visa<ListingRequestDomainPermissions> {
	determineIf(
		func: (permissions: Readonly<ListingRequestDomainPermissions>) => boolean,
	): boolean;
}