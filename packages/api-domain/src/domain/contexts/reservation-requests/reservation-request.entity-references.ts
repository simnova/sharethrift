import type { DomainSeedwork } from '@cellix/domain-seedwork';

/**
 * Listing entity reference for reservation requests
 */
export interface ListingEntityReference extends DomainSeedwork.DomainEntityProps {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly imageUrl?: string;
	readonly ownerId: string;
}

/**
 * Reserver entity reference for reservation requests
 */
export interface ReserverEntityReference extends DomainSeedwork.DomainEntityProps {
	readonly id: string;
	readonly firstName: string;
	readonly lastName: string;
	readonly email: string;
	readonly profileImageUrl?: string;
}