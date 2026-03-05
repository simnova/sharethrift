/**
 * Shared types for listing session operations.
 * Used by both DomainListingSession and GraphQLListingSession.
 */

export interface CreateItemListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images?: string[];
	isDraft?: boolean;
}

export interface ItemListing {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	state: 'draft' | 'published';
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images: string[];
}
