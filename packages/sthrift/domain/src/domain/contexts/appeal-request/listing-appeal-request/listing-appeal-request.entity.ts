import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';

export interface ListingAppealRequestProps extends DomainSeedwork.DomainEntityProps {
	user: Readonly<PersonalUserEntityReference>;
	loadUser: () => Promise<Readonly<PersonalUserEntityReference>>;
	listing: Readonly<ItemListingEntityReference>;
	loadListing: () => Promise<Readonly<ItemListingEntityReference>>;
	reason: string;
	state: string;
	type: string;
	blocker: Readonly<PersonalUserEntityReference>;
	loadBlocker: () => Promise<Readonly<PersonalUserEntityReference>>;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface ListingAppealRequestEntityReference
	extends Readonly<ListingAppealRequestProps> {}
