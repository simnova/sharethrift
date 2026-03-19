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
	// Access props directly to avoid domain entity getters (if domain entity)
	// For plain test objects, use the listing itself as the props
	const listingProps = (listing.props as Record<string, unknown>) || listing;
	
	// Safely extract sharer info - handle both populated domain entities and unpopulated references
	let sharerName = ' '; // Default to single space (matches empty firstName + " " + empty lastName)
	let sharerId = '';

	try {
		// Try to get sharer from props first (domain entity), fallback to listing (test object)
		const sharer = listingProps.sharer || listing.sharer;
		
		if (typeof sharer === 'string') {
			// Unpopulated reference - just an ID
			sharerId = sharer;
			// sharerName already set to 'Unknown'
		} else if (sharer && typeof sharer === 'object') {
			const sharerObj = sharer as Record<string, unknown>;
			
			// Try to get the sharer ID from props or id
			const props = sharerObj.props as Record<string, unknown> | undefined;
			sharerId = (props?.id as string) || (sharerObj.id as string) || '';
			
			// Try to extract account/profile info
			// For domain entities: props.account
			// For test objects: sharerObj.account directly
			const account = (props?.account as Record<string, unknown>) || (sharerObj.account as Record<string, unknown>) || undefined;
			const profile = account?.profile as Record<string, unknown> | undefined;
			
			if (profile) {
				const firstName = (profile.firstName as string) || '';
				const lastName = (profile.lastName as string) || '';
				const displayName = (profile.displayName as string) || '';
				
				// Use displayName if available, otherwise construct from first/last name
				if (displayName) {
					sharerName = displayName;
				} else if (firstName || lastName) {
					// Construct full name - preserve whitespace as-is
					sharerName = `${firstName} ${lastName}`;
				}
			}
		}
	} catch (error) {
		// If anything fails, log and continue with default values
		console.warn(`Failed to extract sharer info for listing ${listing.id}:`, error);
	}

	// Safely extract all listing fields from props
	// For fields that might be value objects (with .value), try that first, then toString(), then the raw value
	const extractValue = (field: unknown): string => {
		if (!field) return '';
		if (typeof field === 'string') return field;
		if (typeof field === 'object') {
			const fieldObj = field as Record<string, unknown>;
			// Check if it's a value object with a .value property
			if (fieldObj.value !== undefined) {
				const val = fieldObj.value;
				if (typeof val === 'string') return val;
				if (typeof val === 'number' || typeof val === 'boolean') return String(val);
				return '';
			}
			// Check if it has a custom toString method
			if (typeof fieldObj.toString === 'function' && fieldObj.toString !== Object.prototype.toString) {
				try {
					// biome-ignore lint/suspicious/noExplicitAny: we verified this has a custom toString
					const result = (fieldObj as any).toString();
					return typeof result === 'string' ? result : '';
				} catch {
					return '';
				}
			}
		}
		return typeof field === 'number' || typeof field === 'boolean' ? String(field) : '';
	};

	const extractId = (value: unknown): string => {
		if (typeof value === 'string') return value;
		if (typeof value === 'number') return String(value);
		return '';
	};

	return {
		id: extractId(listingProps.id) || extractId(listing.id) || '',
		title: extractValue(listingProps.title),
		description: extractValue(listingProps.description),
		category: extractValue(listingProps.category),
		location: extractValue(listingProps.location),
		sharerName,
		sharerId,
		state: extractValue(listingProps.state),
		sharingPeriodStart:
			(listingProps.sharingPeriodStart as Date)?.toISOString() || '',
		sharingPeriodEnd:
			(listingProps.sharingPeriodEnd as Date)?.toISOString() || '',
		createdAt: (listingProps.createdAt as Date)?.toISOString() || '',
		updatedAt: (listingProps.updatedAt as Date)?.toISOString() || '',
		images: Array.isArray(listingProps.images) ? listingProps.images : [],
	};
}
