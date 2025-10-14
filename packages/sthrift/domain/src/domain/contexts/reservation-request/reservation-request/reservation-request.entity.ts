import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.js';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.js';

export interface ReservationRequestProps
	extends DomainSeedwork.DomainEntityProps {
	state: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
	listing: Readonly<ItemListingEntityReference>;
	loadListing(): Promise<ItemListingEntityReference>;
	reserver: Readonly<PersonalUserEntityReference>;
	loadReserver(): Promise<PersonalUserEntityReference>;
	closeRequestedBySharer: boolean;
	closeRequestedByReserver: boolean;
}

export interface ReservationRequestEntityReference
	extends Readonly<Omit<ReservationRequestProps, 'listing' | 'reserver'>> {
	readonly listing: Readonly<ItemListingEntityReference>;
	readonly reserver: Readonly<PersonalUserEntityReference>;
}
