/**
 * Cognitive Search Domain Interfaces
 *
 * Defines the domain-level interfaces for cognitive search functionality
 * in the ShareThrift application.
 */

import type {
	CognitiveSearchBase,
	CognitiveSearchLifecycle,
} from '@cellix/mock-cognitive-search';

/**
 * Domain interface for cognitive search
 * Extends the base interface with domain-specific methods
 */
export interface CognitiveSearchDomain extends CognitiveSearchBase {}

/**
 * Lifecycle interface for cognitive search services
 */
export interface CognitiveSearchDomainInitializeable
	extends CognitiveSearchLifecycle {}

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
 * Search result interface for Item Listings
 */
export interface ItemListingSearchResult {
	items: ItemListingSearchDocument[];
	count: number;
	facets: Record<
		string,
		Array<{
			value: string | number | boolean;
			count: number;
		}>
	>;
}

/**
 * Search input interface for Item Listings
 */
export interface ItemListingSearchInput {
	searchString?: string;
	options?: {
		filter?: ItemListingSearchFilter;
		top?: number;
		skip?: number;
		orderBy?: string[];
	};
}

/**
 * Search filter interface for Item Listings
 */
export interface ItemListingSearchFilter {
	category?: string[];
	state?: string[];
	sharerId?: string[];
	location?: string;
	dateRange?: {
		start?: string;
		end?: string;
	};
}
