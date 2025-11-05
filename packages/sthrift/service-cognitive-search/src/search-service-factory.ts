import { InMemoryCognitiveSearch } from '@cellix/mock-cognitive-search';
import { AzureCognitiveSearch } from './azure-search-service.js';
import type { CognitiveSearchService } from '@cellix/mock-cognitive-search';

/**
 * Configuration for search service factory
 */
export interface SearchServiceConfig {
	useMockSearch?: boolean;
	useAzureSearch?: boolean;
	nodeEnv?: string;
	searchApiEndpoint?: string;
	enablePersistence?: boolean;
	persistencePath?: string;
}

/**
 * Factory for creating CognitiveSearchService instances
 * Extracted from ServiceCognitiveSearch to reduce coupling and improve testability
 */
export class SearchServiceFactory {
	/**
	 * Detects which implementation to use based on configuration
	 */
	static detectImplementation(config: SearchServiceConfig): 'azure' | 'mock' {
		// Force mock mode
		if (config.useMockSearch === true) {
			console.log('SearchServiceFactory: Using mock implementation (forced)');
			return 'mock';
		}

		// Force Azure mode
		if (config.useAzureSearch === true) {
			console.log(
				'SearchServiceFactory: Using Azure implementation (forced)',
			);
			return 'azure';
		}

		// Auto-detect based on environment and credentials
		const hasAzureEndpoint = !!config.searchApiEndpoint;
		const isDevelopment =
			config.nodeEnv === 'development' || config.nodeEnv === 'test';

		if (isDevelopment && !hasAzureEndpoint) {
			console.log(
				'SearchServiceFactory: Using mock implementation (development mode, no Azure endpoint)',
			);
			return 'mock';
		}

		if (hasAzureEndpoint) {
			console.log(
				'SearchServiceFactory: Using Azure implementation (endpoint configured)',
			);
			return 'azure';
		}

		// Default to mock in development, Azure in production
		if (isDevelopment) {
			console.log(
				'SearchServiceFactory: Using mock implementation (development default)',
			);
			return 'mock';
		}

		console.log(
			'SearchServiceFactory: Using Azure implementation (production default)',
		);
		return 'azure';
	}

	/**
	 * Creates the appropriate search service implementation
	 */
	static createSearchService(
		implementationType: 'azure' | 'mock',
		config: SearchServiceConfig = {},
	): CognitiveSearchService {
		if (implementationType === 'mock') {
			return new InMemoryCognitiveSearch({
				enablePersistence: config.enablePersistence ?? false,
				persistencePath:
					config.persistencePath || './.dev-data/search-indexes',
			});
		}

		// Use Azure Cognitive Search implementation
		try {
			return new AzureCognitiveSearch();
		} catch (error) {
			console.error(
				'SearchServiceFactory: Failed to create Azure implementation:',
				error,
			);
			console.warn(
				'SearchServiceFactory: Falling back to mock implementation due to Azure configuration error',
			);
			return new InMemoryCognitiveSearch({
				enablePersistence: config.enablePersistence ?? false,
				persistencePath:
					config.persistencePath || './.dev-data/search-indexes',
			});
		}
	}

	/**
	 * Creates search service from environment variables (for backward compatibility)
	 */
	static createFromEnvironment(): CognitiveSearchService {
		const config: SearchServiceConfig = {
			useMockSearch: process.env['USE_MOCK_SEARCH'] === 'true',
			useAzureSearch: process.env['USE_AZURE_SEARCH'] === 'true',
			...(process.env['NODE_ENV'] !== undefined && {
				nodeEnv: process.env['NODE_ENV'],
			}),
			...(process.env['SEARCH_API_ENDPOINT'] !== undefined && {
				searchApiEndpoint: process.env['SEARCH_API_ENDPOINT'],
			}),
			enablePersistence: process.env['ENABLE_SEARCH_PERSISTENCE'] === 'true',
			...(process.env['SEARCH_PERSISTENCE_PATH'] !== undefined && {
				persistencePath: process.env['SEARCH_PERSISTENCE_PATH'],
			}),
		};

		const implementationType = this.detectImplementation(config);
		return this.createSearchService(implementationType, config);
	}
}

