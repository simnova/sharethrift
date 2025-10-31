import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';

export interface ItemListingProps extends DomainSeedwork.DomainEntityProps {
	sharer: Readonly<PersonalUserEntityReference>;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: string;
	readonly createdAt: Date;
	updatedAt: Date;
	readonly schemaVersion: string;
	sharingHistory?: string[]; // Array of reservation/sharing IDs
	reports?: number;
	images?: string[]; // Array of image URLs
    listingType: string;
}

export interface ItemListingEntityReference
	extends Readonly<Omit<ItemListingProps, 'sharingHistory' | 'images'>> {
	sharingHistory?: string[];
	images?: string[];
}
