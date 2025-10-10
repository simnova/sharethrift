/**
 * Event Handlers
 *
 * Exports all event handlers for the ShareThrift application.
 */

import type { DomainDataSource } from '@sthrift/domain';
import type { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';
import { registerItemListingUpdatedUpdateSearchIndexHandler } from './item-listing-updated-update-search-index.js';
import { registerItemListingDeletedUpdateSearchIndexHandler as registerDeletedHandler } from './item-listing-deleted-update-search-index.js';

export * from './search-index-helpers.js';
export * from './item-listing-updated-update-search-index.js';
export * from './item-listing-deleted-update-search-index.js';

/**
 * Register all event handlers for the ShareThrift application
 */
export const RegisterEventHandlers = (
	domainDataSource: DomainDataSource,
	searchService?: ServiceCognitiveSearch,
): void => {
	console.log('Registering ShareThrift event handlers...');

	// Register search index event handlers if search service is available
	if (searchService) {
		console.log('Registering search index event handlers...');

		// Get the item listing unit of work from domain data source
		const itemListingUnitOfWork = domainDataSource.itemListingUnitOfWork;

		// Register search index update handlers
		registerItemListingUpdatedUpdateSearchIndexHandler(
			searchService,
			itemListingUnitOfWork,
		);
		registerDeletedHandler(searchService);

		console.log('Search index event handlers registered successfully');
	} else {
		console.log(
			'Search service not available, skipping search index event handlers',
		);
	}

	// TODO: Register other event handlers here as needed
	// RegisterDomainEventHandlers(domainDataSource);
	// RegisterIntegrationEventHandlers(domainDataSource);

	console.log('ShareThrift event handlers registration complete');
};
