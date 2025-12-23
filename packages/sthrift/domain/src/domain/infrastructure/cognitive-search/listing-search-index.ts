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
 * Safely extracts data from domain entities that may have incomplete nested data
 * IMPORTANT: Accesses props directly to avoid triggering getters that may fail on incomplete data
 */
export function convertListingToSearchDocument(
	listing: Record<string, unknown>,
): Record<string, unknown> {
	// Access props directly to avoid domain entity getters
	const listingProps = (listing.props as Record<string, unknown>) || {};
	
	// Safely extract sharer info - handle both populated domain entities and unpopulated references
	let sharerName = 'Unknown';
	let sharerId = '';

	try {
		const { sharer } = listing;
		
		if (typeof sharer === 'string') {
			// Unpopulated reference - just an ID
			sharerId = sharer;
			// sharerName already set to 'Unknown'
		} else if (sharer && typeof sharer === 'object') {
			const sharerObj = sharer as Record<string, unknown>;
			
			// Try to get the sharer ID from props or id
			const props = sharerObj.props as Record<string, unknown> | undefined;
			sharerId = (props?.id as string) || (sharerObj.id as string) || '';
			
			// Try to extract account/profile info from props (avoiding getters)
			const account = props?.account as Record<string, unknown> | undefined;
			const profile = account?.profile as Record<string, unknown> | undefined;
			
			if (profile) {
				const firstName = (profile.firstName as string) || '';
				const lastName = (profile.lastName as string) || '';
				const displayName = (profile.displayName as string) || '';
				
				// Use displayName if available, otherwise construct from first/last name
				if (displayName) {
					sharerName = displayName.trim();
				} else if (firstName || lastName) {
					sharerName = `${firstName} ${lastName}`.trim();
				}
			}
		}
	} catch (error) {
		// If anything fails, log and continue with default values
		console.warn(`Failed to extract sharer info for listing ${listing.id}:`, error);
	}

	// Safely extract all listing fields from props
	const description = listingProps.description as Record<string, unknown> | undefined;
	const category = listingProps.category as Record<string, unknown> | undefined;
	const location = listingProps.location as Record<string, unknown> | undefined;
	const state = listingProps.state as Record<string, unknown> | undefined;

	return {
		id: listingProps.id || listing.id,
		title: listingProps.title || '',
		description: description?.value?.toString() || '',
		category: category?.value?.toString() || '',
		location: location?.value?.toString() || '',
		sharerName,
		sharerId,
		state: state?.value?.toString() || '',
		sharingPeriodStart:
			(listingProps.sharingPeriodStart as Date)?.toISOString() || '',
		sharingPeriodEnd:
			(listingProps.sharingPeriodEnd as Date)?.toISOString() || '',
		createdAt: (listingProps.createdAt as Date)?.toISOString() || '',
		updatedAt: (listingProps.updatedAt as Date)?.toISOString() || '',
		images: listingProps.images || [],
	};
}
