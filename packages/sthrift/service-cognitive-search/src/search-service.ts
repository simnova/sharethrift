import type { ServiceBase } from '@cellix/api-services-spec';
import { InMemoryCognitiveSearch } from '@cellix/mock-cognitive-search';
import type { CognitiveSearchService } from '@cellix/mock-cognitive-search';

/**
 * Cognitive Search Service for ShareThrift
 *
 * Automatically detects environment and chooses between Azure Cognitive Search
 * and Mock implementation based on available credentials and configuration.
 */
export class ServiceCognitiveSearch implements ServiceBase<unknown> {
	private searchService: CognitiveSearchService;
	private implementationType: 'azure' | 'mock';

	constructor() {
		this.implementationType = this.detectImplementation();
		this.searchService = this.createSearchService();
	}

	/**
	 * Detects which implementation to use based on environment variables
	 */
	private detectImplementation(): 'azure' | 'mock' {
		// Force mock mode
		if (process.env['USE_MOCK_SEARCH'] === 'true') {
			console.log('ServiceCognitiveSearch: Using mock implementation (forced)');
			return 'mock';
		}

		// Force Azure mode
		if (process.env['USE_AZURE_SEARCH'] === 'true') {
			console.log(
				'ServiceCognitiveSearch: Using Azure implementation (forced)',
			);
			return 'azure';
		}

		// Auto-detect based on environment and credentials
		const hasAzureEndpoint = !!process.env['SEARCH_API_ENDPOINT'];
		const isDevelopment =
			process.env['NODE_ENV'] === 'development' ||
			process.env['NODE_ENV'] === 'test';

		if (isDevelopment && !hasAzureEndpoint) {
			console.log(
				'ServiceCognitiveSearch: Using mock implementation (development mode, no Azure endpoint)',
			);
			return 'mock';
		}

		if (hasAzureEndpoint) {
			console.log(
				'ServiceCognitiveSearch: Using Azure implementation (endpoint configured)',
			);
			return 'azure';
		}

		// Default to mock in development, Azure in production
		if (isDevelopment) {
			console.log(
				'ServiceCognitiveSearch: Using mock implementation (development default)',
			);
			return 'mock';
		}

		console.log(
			'ServiceCognitiveSearch: Using Azure implementation (production default)',
		);
		return 'azure';
	}

	/**
	 * Creates the appropriate search service implementation
	 */
	private createSearchService(): CognitiveSearchService {
		if (this.implementationType === 'mock') {
			return new InMemoryCognitiveSearch({
				enablePersistence: process.env['ENABLE_SEARCH_PERSISTENCE'] === 'true',
				persistencePath:
					process.env['SEARCH_PERSISTENCE_PATH'] ||
					'./.dev-data/search-indexes',
			});
		}

		// TODO: Implement Azure Cognitive Search wrapper when needed
		// For now, fall back to mock if Azure is requested but not implemented
		console.warn(
			'ServiceCognitiveSearch: Azure implementation not yet available, falling back to mock',
		);
		return new InMemoryCognitiveSearch({
			enablePersistence: process.env['ENABLE_SEARCH_PERSISTENCE'] === 'true',
			persistencePath:
				process.env['SEARCH_PERSISTENCE_PATH'] || './.dev-data/search-indexes',
		});
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
	async createIndexIfNotExists(
		indexDefinition: Record<string, unknown>,
	): Promise<void> {
		return (this.searchService as any).createIndexIfNotExists(indexDefinition);
	}

	async createOrUpdateIndexDefinition(
		indexName: string,
		indexDefinition: Record<string, unknown>,
	): Promise<void> {
		return (this.searchService as any).createOrUpdateIndexDefinition(
			indexName,
			indexDefinition,
		);
	}

	async indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		return (this.searchService as any).indexDocument(indexName, document);
	}

	async deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		return (this.searchService as any).deleteDocument(indexName, document);
	}

	async deleteIndex(indexName: string): Promise<void> {
		return (this.searchService as any).deleteIndex(indexName);
	}

	async search(
		indexName: string,
		searchText: string,
		options?: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		return (this.searchService as any).search(indexName, searchText, options);
	}

	async indexExists(indexName: string): Promise<boolean> {
		return (this.searchService as any).indexExists(indexName);
	}
}
