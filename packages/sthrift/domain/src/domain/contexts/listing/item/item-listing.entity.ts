import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserEntityReference } from '../../user/index.ts';

export interface ItemListingProps extends DomainSeedwork.DomainEntityProps {
	sharer: Readonly<UserEntityReference>;
  loadSharer(): Promise<UserEntityReference>;
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
    expiresAt?: Date | undefined; // TTL field for automatic expiration
}

export interface ItemListingEntityReference
	extends Readonly<Omit<ItemListingProps, 'sharer'>> {
	readonly sharer: UserEntityReference;
}
