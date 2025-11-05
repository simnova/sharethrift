import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	CognitiveSearchService,
	SearchIndex,
	CognitiveSearchBase,
	SearchOptions,
	SearchDocumentsResult,
} from '@cellix/mock-cognitive-search';
import { SearchServiceFactory } from './search-service-factory.js';

/**
 * Cognitive Search Service for ShareThrift
 *
 * Automatically detects environment and chooses between Azure Cognitive Search
 * and Mock implementation based on available credentials and configuration.
 */
export class ServiceCognitiveSearch
	implements ServiceBase<unknown>, CognitiveSearchBase
{
	private searchService: CognitiveSearchService;
	private implementationType: 'azure' | 'mock';

	constructor(config?: {
		useMockSearch?: boolean;
		useAzureSearch?: boolean;
		nodeEnv?: string;
		searchApiEndpoint?: string;
		enablePersistence?: boolean;
		persistencePath?: string;
	}) {
		// Use factory for environment detection and service creation
		// If no config provided, use environment variables (backward compatibility)
		if (config) {
			this.implementationType = SearchServiceFactory.detectImplementation(
				config,
			);
			this.searchService = SearchServiceFactory.createSearchService(
				this.implementationType,
				config,
			);
		} else {
			this.implementationType = SearchServiceFactory.detectImplementation({
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
			});
			this.searchService = SearchServiceFactory.createFromEnvironment();
		}
	}

	/**
	 * ServiceBase implementation
	 */
	async startUp(): Promise<void> {
		console.log(
			`ServiceCognitiveSearch: Starting up with ${this.implementationType} implementation`,
		);
		await this.searchService.startup();
	}

	async shutDown(): Promise<void> {
		console.log('ServiceCognitiveSearch: Shutting down');
		await this.searchService.shutdown();
	}

	/**
	 * Proxy methods to the underlying search service
	 */
	async createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
		return await this.searchService.createIndexIfNotExists(indexDefinition);
	}

	async createOrUpdateIndexDefinition(
		indexName: string,
		indexDefinition: SearchIndex,
	): Promise<void> {
		return await this.searchService.createOrUpdateIndexDefinition(
			indexName,
			indexDefinition,
		);
	}

	async indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		return await this.searchService.indexDocument(indexName, document);
	}

	async deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		return await this.searchService.deleteDocument(indexName, document);
	}

	async deleteIndex(indexName: string): Promise<void> {
		return await this.searchService.deleteIndex(indexName);
	}

	async search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult> {
		return await this.searchService.search(indexName, searchText, options);
	}

	async indexExists(indexName: string): Promise<boolean> {
		// Delegate to underlying service if it has indexExists method
		// (AzureCognitiveSearch implements this efficiently)
		if (
			'indexExists' in this.searchService &&
			typeof this.searchService.indexExists === 'function'
		) {
			return await this.searchService.indexExists(indexName);
		}
		// Fallback: check if index can be searched (for mock implementation)
		try {
			await this.searchService.search(indexName, '*', { top: 1 });
			return true;
		} catch {
			return false;
		}
	}
}
