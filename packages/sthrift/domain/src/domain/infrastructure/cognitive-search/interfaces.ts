/**
 * Cognitive Search Domain Interfaces
 *
 * Defines the domain-level interfaces for cognitive search functionality
 * in the ShareThrift application.
 */

import type { SearchService } from '@cellix/search-service';

/**
 * Domain interface for cognitive search
 * Uses the generic SearchService interface
 */
export interface CognitiveSearchDomain extends SearchService {}

/**
 * Search index document interface for Item Listings
 */
export interface ItemListingSearchDocument {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharerName: string;
	sharerId: string;
	state: string;
	sharingPeriodStart: string; // ISO date string
	sharingPeriodEnd: string; // ISO date string
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	images: string[];
}

/**
 * Search facet value
 */
export interface SearchFacet {
	value: string;
	count: number;
}

/**
 * Search facets grouped by field
 */
export interface SearchFacets {
	category?: SearchFacet[];
	state?: SearchFacet[];
	sharerId?: SearchFacet[];
	createdAt?: SearchFacet[];
}

/**
 * Search result interface for Item Listings
 */
export interface ItemListingSearchResult {
	items: ItemListingSearchDocument[];
	count: number;
	facets?: SearchFacets;
}

/**
 * Search input interface for Item Listings
 */
export interface ItemListingSearchInput {
	searchString?: string | null;
	options?: {
		filter?: ItemListingSearchFilter | null;
		top?: number | null;
		skip?: number | null;
		orderBy?: readonly string[] | null;
	} | null;
}

/**
 * Search filter interface for Item Listings
 */
export interface ItemListingSearchFilter {
	category?: readonly string[] | null;
	state?: readonly string[] | null;
	sharerId?: readonly string[] | null;
	location?: string | null;
	dateRange?: {
		start?: string | null;
		end?: string | null;
	} | null;
}
