/**
 * Item Listing Search Index Definition
 *
 * Defines the Azure Cognitive Search index schema for Item Listings.
 * This index enables full-text search and filtering of item listings
 * in the ShareThrift application.
 */

import type { SearchIndex } from '@cellix/mock-cognitive-search';

/**
 * Search index definition for Item Listings
 */
export const ItemListingSearchIndexSpec: SearchIndex = {
	name: 'item-listings',
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
 * Helper function to convert ItemListing domain entity to search document
 */
export function convertItemListingToSearchDocument(
	itemListing: Record<string, unknown>,
): Record<string, unknown> {
	const sharer = itemListing.sharer as Record<string, unknown> | undefined;
	const account = sharer?.account as Record<string, unknown> | undefined;
	const profile = account?.profile as Record<string, unknown> | undefined;

	return {
		id: itemListing.id,
		title: itemListing.title,
		description: itemListing.description?.toString() || '',
		category: itemListing.category?.toString() || '',
		location: itemListing.location?.toString() || '',
		sharerName:
			(profile?.firstName?.toString() || '') +
				' ' +
				(profile?.lastName?.toString() || '') || '',
		sharerId: sharer?.id || '',
		state: itemListing.state?.toString() || '',
		sharingPeriodStart:
			(itemListing.sharingPeriodStart as Date)?.toISOString() || '',
		sharingPeriodEnd:
			(itemListing.sharingPeriodEnd as Date)?.toISOString() || '',
		createdAt: (itemListing.createdAt as Date)?.toISOString() || '',
		updatedAt: (itemListing.updatedAt as Date)?.toISOString() || '',
		images: itemListing.images || [],
	};
}
