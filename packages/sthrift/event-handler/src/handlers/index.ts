/**
 * Event Handlers
 *
 * Exports all event handlers for the ShareThrift application.
 */

import type { DomainDataSource } from '@sthrift/domain';
import type { SearchService } from '@cellix/search-service';
import { RegisterIntegrationEventHandlers } from './integration/index.js';

export * from './search-index-helpers.js';
export * from './bulk-index-existing-listings.js';

/**
 * Register all event handlers for the ShareThrift application
 */
export const RegisterEventHandlers = (
	domainDataSource: DomainDataSource,
	searchService?: SearchService,
): void => {
	console.log('Registering ShareThrift event handlers...');

	// Register search index event handlers if search service is available
	if (searchService) {
		console.log('Registering search index event handlers...');

		RegisterIntegrationEventHandlers(domainDataSource, searchService);

		console.log('Search index event handlers registered successfully');
	} else {
		console.log(
			'Search service not available, skipping search index event handlers',
		);
	}

	console.log('ShareThrift event handlers registration complete');
};
