/**
 * Listing Search Index Definition
 *
 * Defines the Azure Cognitive Search index schema for Listings.
 * This index enables full-text search and filtering of listings
 * in the ShareThrift application.
 */

import type { SearchIndex } from '@cellix/search-service';

/**
 * Search index definition for Listings
 */
export const ListingSearchIndexSpec: SearchIndex = {
	name: 'listings',
	fields: [
		// Primary key
		{
			name: 'id',
			type: 'Edm.String',
			key: true,
			searchable: false,
			filterable: true,
			sortable: false,
			facetable: false,
			retrievable: true,
		},

		// Searchable text fields
		{
			name: 'title',
			type: 'Edm.String',
			searchable: true,
			filterable: false,
			sortable: true,
			facetable: false,
			retrievable: true,
		},
		{
			name: 'description',
			type: 'Edm.String',
			searchable: true,
			filterable: false,
			sortable: false,
			facetable: false,
			retrievable: true,
		},
		{
			name: 'location',
			type: 'Edm.String',
			searchable: true,
			filterable: true,
			sortable: false,
			facetable: false,
			retrievable: true,
		},

		// Filterable and facetable fields
		{
			name: 'category',
			type: 'Edm.String',
			searchable: false,
			filterable: true,
			sortable: true,
			facetable: true,
			retrievable: true,
		},
		{
			name: 'state',
			type: 'Edm.String',
			searchable: false,
			filterable: true,
			sortable: true,
			facetable: true,
			retrievable: true,
		},

		// Sharer information
		{
			name: 'sharerName',
			type: 'Edm.String',
			searchable: true,
			filterable: false,
			sortable: true,
			facetable: false,
			retrievable: true,
		},
		{
			name: 'sharerId',
			type: 'Edm.String',
			searchable: false,
			filterable: true,
			sortable: false,
			facetable: true,
			retrievable: true,
		},

		// Date fields
		{
			name: 'sharingPeriodStart',
			type: 'Edm.DateTimeOffset',
			searchable: false,
			filterable: true,
			sortable: true,
			facetable: false,
			retrievable: true,
		},
		{
			name: 'sharingPeriodEnd',
			type: 'Edm.DateTimeOffset',
			searchable: false,
			filterable: true,
			sortable: true,
			facetable: false,
			retrievable: true,
		},
		{
			name: 'createdAt',
			type: 'Edm.DateTimeOffset',
			searchable: false,
			filterable: true,
			sortable: true,
			facetable: true,
			retrievable: true,
		},
		{
			name: 'updatedAt',
			type: 'Edm.DateTimeOffset',
			searchable: false,
			filterable: true,
			sortable: true,
			facetable: true,
			retrievable: true,
		},

		// Array fields
		{
			name: 'images',
			type: 'Collection(Edm.String)',
			searchable: false,
			filterable: false,
			sortable: false,
			facetable: false,
			retrievable: true,
		},
	],
};

/**
 * Helper function to convert Listing domain entity to search document
 */
export function convertListingToSearchDocument(
	listing: Record<string, unknown>,
): Record<string, unknown> {
	const sharer = listing.sharer as Record<string, unknown> | undefined;
	const account = sharer?.account as Record<string, unknown> | undefined;
	const profile = account?.profile as Record<string, unknown> | undefined;

	return {
		id: listing.id,
		title: listing.title,
		description: listing.description?.toString() || '',
		category: listing.category?.toString() || '',
		location: listing.location?.toString() || '',
		sharerName:
			(profile?.firstName?.toString() || '') +
				' ' +
				(profile?.lastName?.toString() || '') || '',
		sharerId: sharer?.id || '',
		state: listing.state?.toString() || '',
		sharingPeriodStart:
			(listing.sharingPeriodStart as Date)?.toISOString() || '',
		sharingPeriodEnd:
			(listing.sharingPeriodEnd as Date)?.toISOString() || '',
		createdAt: (listing.createdAt as Date)?.toISOString() || '',
		updatedAt: (listing.updatedAt as Date)?.toISOString() || '',
		images: listing.images || [],
	};
}
