import {
	SearchClient,
	SearchIndexClient,
	AzureKeyCredential,
} from '@azure/search-documents';
import { DefaultAzureCredential } from '@azure/identity';
import type {
	SearchIndex,
	CognitiveSearchBase,
	SearchOptions,
	SearchDocumentsResult,
	SearchField,
} from '@cellix/mock-cognitive-search';
import { logger } from './logger.js';

// Constants for document key field names
const DOCUMENT_ID_FIELD = 'id';
const DOCUMENT_KEY_FIELD = 'key';

// Azure type mapping constant
const AZURE_TYPE_MAP: Record<string, string> = {
	'Edm.String': 'Edm.String',
	'Edm.Int32': 'Edm.Int32',
	'Edm.Double': 'Edm.Double',
	'Edm.Boolean': 'Edm.Boolean',
	'Edm.DateTimeOffset': 'Edm.DateTimeOffset',
	'Edm.GeographyPoint': 'Edm.GeographyPoint',
	'Collection(Edm.String)': 'Collection(Edm.String)',
	'Collection(Edm.ComplexType)': 'Collection(Edm.ComplexType)',
	'Edm.ComplexType': 'Edm.ComplexType',
};

/**
 * Azure Cognitive Search implementation
 *
 * Provides a wrapper around Azure Cognitive Search that implements
 * the CognitiveSearchBase interface for consistency with the mock implementation.
 */
export class AzureCognitiveSearch implements CognitiveSearchBase {
	private indexClient: SearchIndexClient;
	private searchClients: Map<string, SearchClient<Record<string, unknown>>> =
		new Map();
	private endpoint: string;
	private credential: AzureKeyCredential | DefaultAzureCredential;

	constructor() {
		this.endpoint = process.env['AZURE_SEARCH_ENDPOINT'] || '';
		if (!this.endpoint) {
			throw new Error(
				'AZURE_SEARCH_ENDPOINT environment variable is required for Azure Cognitive Search',
			);
		}

		// Use API key if provided, otherwise use Azure credentials
		const apiKey = process.env['SEARCH_API_KEY'];
		if (apiKey) {
			this.credential = new AzureKeyCredential(apiKey);
			logger.info('AzureCognitiveSearch: Using API key authentication');
		} else {
			this.credential = new DefaultAzureCredential();
			logger.info(
				'AzureCognitiveSearch: Using Azure credential authentication',
			);
		}

		this.indexClient = new SearchIndexClient(this.endpoint, this.credential);
	}

	/**
	 * Service lifecycle methods
	 */
	async startup(): Promise<void> {
		logger.info('AzureCognitiveSearch: Starting up');
		// Azure client doesn't need explicit startup - connection is lazy
		await Promise.resolve();
	}

	async shutdown(): Promise<void> {
		logger.info('AzureCognitiveSearch: Shutting down');
		this.searchClients.clear();
		await Promise.resolve();
	}

	/**
	 * Convert our SearchIndex format to Azure's SearchIndex format
	 */
	private convertToAzureIndex(
		indexDefinition: SearchIndex,
	): Record<string, unknown> {
		return {
			name: indexDefinition.name,
			fields: indexDefinition.fields.map(this.mapField.bind(this)),
		};
	}

	/**
	 * Map a single SearchField to Azure field format
	 */
	private mapField(field: SearchField): Record<string, unknown> {
		return {
			name: field.name,
			type: AZURE_TYPE_MAP[field.type] ?? 'Edm.String',
			searchable: !!field.searchable,
			filterable: !!field.filterable,
			sortable: !!field.sortable,
			facetable: !!field.facetable,
			key: !!field.key,
			retrievable: field.retrievable !== false,
		};
	}

	/**
	 * Get or create a search client for the given index
	 */
	private getSearchClient(
		indexName: string,
	): SearchClient<Record<string, unknown>> {
		if (!this.searchClients.has(indexName)) {
			const client = new SearchClient<Record<string, unknown>>(
				this.endpoint,
				indexName,
				this.credential,
			);
			this.searchClients.set(indexName, client);
		}
		const client = this.searchClients.get(indexName);
		if (!client) {
			throw new Error(`Search client not found for index: ${indexName}`);
		}
		return client;
	}

	/**
	 * Index management methods
	 */
	async createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
		try {
			const azureIndex = this.convertToAzureIndex(indexDefinition);
			await this.indexClient.createOrUpdateIndex(azureIndex as any);
			logger.info(
				`AzureCognitiveSearch: Index ${indexDefinition.name} created or updated`,
			);
		} catch (error) {
			logger.error(
				`AzureCognitiveSearch: Failed to create index ${indexDefinition.name}:`,
				error,
			);
			throw error;
		}
	}

	async createOrUpdateIndexDefinition(
		_indexName: string,
		indexDefinition: SearchIndex,
	): Promise<void> {
		return await this.createIndexIfNotExists(indexDefinition);
	}

	async deleteIndex(indexName: string): Promise<void> {
		try {
			await this.indexClient.deleteIndex(indexName);
			this.searchClients.delete(indexName);
			logger.info(`AzureCognitiveSearch: Index ${indexName} deleted`);
		} catch (error) {
			logger.error(
				`AzureCognitiveSearch: Failed to delete index ${indexName}:`,
				error,
			);
			throw error;
		}
	}

	async indexExists(indexName: string): Promise<boolean> {
		try {
			await this.indexClient.getIndex(indexName);
			return true;
		} catch {
			// Index doesn't exist if we get a 404
			return false;
		}
	}

	/**
	 * Document operations
	 */
	async indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		try {
			const client = this.getSearchClient(indexName);
			await client.mergeOrUploadDocuments([document]);
			logger.debug(`AzureCognitiveSearch: Document indexed in ${indexName}`);
		} catch (error) {
			logger.error(
				`AzureCognitiveSearch: Failed to index document in ${indexName}:`,
				error,
			);
			throw error;
		}
	}

	async deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		try {
			const client = this.getSearchClient(indexName);
			// Azure requires the key field for deletion
			// Determine the field name (not the value)
			const keyFieldName =
				document[DOCUMENT_ID_FIELD] !== undefined
					? DOCUMENT_ID_FIELD
					: DOCUMENT_KEY_FIELD;
			const keyFieldValue = document[keyFieldName];
			if (keyFieldValue === undefined || keyFieldValue === null) {
				throw new Error('Document must have an id or key field for deletion');
			}
			await client.deleteDocuments([{ [keyFieldName]: keyFieldValue }]);
			logger.debug(`AzureCognitiveSearch: Document deleted from ${indexName}`);
		} catch (error) {
			logger.error(
				`AzureCognitiveSearch: Failed to delete document from ${indexName}:`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Search operations
	 */
	async search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult> {
		try {
			const client = this.getSearchClient(indexName);
			const azureOptions = this.mapOptions(options);
			const result = await client.search(searchText, azureOptions);

			// Convert Azure result to our format
			const documents: Array<{
				document: Record<string, unknown>;
				score?: number;
			}> = [];
			for await (const doc of result.results) {
				documents.push({
					document: doc.document,
					score: doc.score,
				});
			}

			return {
				results: documents,
				count: result.count || 0,
				facets: this.mapFacets(result.facets),
			};
		} catch (error) {
			logger.error(
				`AzureCognitiveSearch: Failed to search ${indexName}:`,
				error,
			);
			throw error;
		}
	}

	/**
	 * Map SearchOptions to Azure search options format
	 */
	private mapOptions(options?: SearchOptions): Record<string, unknown> {
		if (!options) {
			return {};
		}
		const optionKeys: Array<keyof SearchOptions> = [
			'top',
			'skip',
			'filter',
			'facets',
			'orderBy',
			'includeTotalCount',
		];
		return optionKeys.reduce(
			(acc, key) => {
				if (options[key] != null) {
					acc[key] = options[key];
				}
				return acc;
			},
			{} as Record<string, unknown>,
		);
	}

	/**
	 * Map Azure facets to our facets format
	 */
	private mapFacets(
		facets?: Record<string, Array<{ value?: unknown; count?: number }>>,
	): Record<
		string,
		Array<{ value: string | number | boolean; count: number }>
	> {
		if (!facets) {
			return {};
		}
		return Object.entries(facets).reduce(
			(acc, [key, facetArray]) => {
				acc[key] = facetArray.map((facet) => {
					const value = facet.value ?? '';
					// Type assertion: Azure facets return string, number, or boolean values
					return {
						value: value as string | number | boolean,
						count: facet.count ?? 0,
					};
				});
				return acc;
			},
			{} as Record<
				string,
				Array<{ value: string | number | boolean; count: number }>
			>,
		);
	}
}
