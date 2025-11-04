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

// Constants for document key field names
const DOCUMENT_ID_FIELD = 'id';
const DOCUMENT_KEY_FIELD = 'key';

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
		this.endpoint = process.env['SEARCH_API_ENDPOINT'] || '';
		if (!this.endpoint) {
			throw new Error(
				'SEARCH_API_ENDPOINT environment variable is required for Azure Cognitive Search',
			);
		}

		// Use API key if provided, otherwise use Azure credentials
		const apiKey = process.env['SEARCH_API_KEY'];
		if (apiKey) {
			this.credential = new AzureKeyCredential(apiKey);
			console.log('AzureCognitiveSearch: Using API key authentication');
		} else {
			this.credential = new DefaultAzureCredential();
			console.log(
				'AzureCognitiveSearch: Using Azure credential authentication',
			);
		}

		this.indexClient = new SearchIndexClient(this.endpoint, this.credential);
	}

	/**
	 * Service lifecycle methods
	 */
	async startup(): Promise<void> {
		console.log('AzureCognitiveSearch: Starting up');
		// Azure client doesn't need explicit startup - connection is lazy
		await Promise.resolve();
	}

	async shutdown(): Promise<void> {
		console.log('AzureCognitiveSearch: Shutting down');
		this.searchClients.clear();
		await Promise.resolve();
	}

	/**
	 * Convert our SearchIndex format to Azure's SearchIndex format
	 */
	private convertToAzureIndex(
		indexDefinition: SearchIndex,
	): Record<string, unknown> {
		const azureFields = indexDefinition.fields.map((field: SearchField) => ({
			name: field.name,
			type: this.convertFieldType(field.type),
			searchable: field.searchable || false,
			filterable: field.filterable || false,
			sortable: field.sortable || false,
			facetable: field.facetable || false,
			key: field.key || false,
			retrievable: field.retrievable !== false, // Default to true
		}));

		return {
			name: indexDefinition.name,
			fields: azureFields,
		};
	}

	/**
	 * Convert our field types to Azure field types
	 */
	private convertFieldType(type: string): string {
		const typeMap: Record<string, string> = {
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

		return typeMap[type] || 'Edm.String';
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
			console.log(
				`AzureCognitiveSearch: Index ${indexDefinition.name} created or updated`,
			);
		} catch (error) {
			console.error(
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
			console.log(`AzureCognitiveSearch: Index ${indexName} deleted`);
		} catch (error) {
			console.error(
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
			console.log(`AzureCognitiveSearch: Document indexed in ${indexName}`);
		} catch (error) {
			console.error(
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
			await client.deleteDocuments([
				{ [keyFieldName]: keyFieldValue },
			]);
			console.log(`AzureCognitiveSearch: Document deleted from ${indexName}`);
		} catch (error) {
			console.error(
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

			// Convert our options to Azure search options
			const azureOptions: Record<string, unknown> = {};

			if (options && 'top' in options) {
				azureOptions['top'] = (options as any)['top'];
			}
			if (options && 'skip' in options) {
				azureOptions['skip'] = (options as any)['skip'];
			}
			if (options && 'filter' in options) {
				azureOptions['filter'] = (options as any)['filter'];
			}
			if (options && 'facets' in options) {
				azureOptions['facets'] = (options as any)['facets'];
			}
			if (options && 'orderBy' in options) {
				azureOptions['orderBy'] = (options as any)['orderBy'];
			}
			if (options && 'includeTotalCount' in options) {
				azureOptions['includeTotalCount'] = (options as any)[
					'includeTotalCount'
				];
			}

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

			// Convert Azure facets to our format
			const convertedFacets: Record<
				string,
				Array<{ value: string | number | boolean; count: number }>
			> = {};
			if (result.facets) {
				for (const [key, facetArray] of Object.entries(result.facets)) {
					convertedFacets[key] = facetArray.map((facet) => ({
						value: facet['value'] || '',
						count: facet['count'] || 0,
					}));
				}
			}

			return {
				results: documents,
				count: result.count || 0,
				facets: convertedFacets,
			};
		} catch (error) {
			console.error(
				`AzureCognitiveSearch: Failed to search ${indexName}:`,
				error,
			);
			throw error;
		}
	}
}
