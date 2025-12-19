import type { SearchIndex } from '@cellix/search-service';

/**
 * Listing Search Index Definition
 *
 * Defines the search index structure for listings in ShareThrift.
 * This index supports full-text search, filtering, sorting, and faceting
 * for listing discovery functionality.
 */

const indexName =
	process.env['SEARCH_LISTING_INDEX_NAME'] || 'listings';

export const ListingSearchIndexSpec: SearchIndex = {
	name: indexName,
	fields: [
		{
			name: 'id',
			type: 'Edm.String',
			key: true,
			searchable: true,
			filterable: false,
			sortable: false,
			facetable: false,
			retrievable: true,
		},
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
			name: 'category',
			type: 'Edm.String',
			searchable: true,
			filterable: true,
			sortable: true,
			facetable: true,
			retrievable: true,
		},
		{
			name: 'location',
			type: 'Edm.String',
			searchable: true,
			filterable: true,
			sortable: false,
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
		{
			name: 'sharerId',
			type: 'Edm.String',
			searchable: false,
			filterable: true,
			sortable: false,
			facetable: true,
			retrievable: true,
		},
		{
			name: 'sharerName',
			type: 'Edm.String',
			searchable: true,
			filterable: false,
			sortable: false,
			facetable: false,
			retrievable: true,
		},
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
 * TypeScript interface matching the search index document structure
 */
export interface ListingSearchDocument {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	state: string;
	sharerId: string;
	sharerName: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	createdAt: Date;
	updatedAt: Date;
	images: string[];
}
