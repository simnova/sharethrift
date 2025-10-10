import type {
	CognitiveSearchBase,
	CognitiveSearchLifecycle,
	SearchDocumentsResult,
	SearchIndex,
	SearchOptions,
	SearchResult,
} from './interfaces.js';

/**
 * In-memory implementation of Azure Cognitive Search
 *
 * Provides basic search functionality for development environments:
 * - Document storage and retrieval
 * - Simple text search
 * - Basic filtering
 * - Pagination support
 *
 * Note: This is intentionally simplified and does not implement
 * full OData filter parsing or complex search features.
 */
class InMemoryCognitiveSearch
	implements CognitiveSearchBase, CognitiveSearchLifecycle
{
	private indexes: Map<string, SearchIndex> = new Map();
	private documents: Map<string, Map<string, Record<string, unknown>>> =
		new Map();
	private isInitialized = false;

	constructor(
		options: {
			enablePersistence?: boolean;
			persistencePath?: string;
		} = {},
	) {
		// Store options for future use
		void options;
	}

	startup(): Promise<void> {
		if (this.isInitialized) {
			return Promise.resolve();
		}

		console.log('InMemoryCognitiveSearch: Starting up...');

		// TODO: Add optional file persistence here if needed
		// For now, we'll keep everything in memory

		this.isInitialized = true;
		console.log('InMemoryCognitiveSearch: Started successfully');
		return Promise.resolve();
	}

	shutdown(): Promise<void> {
		console.log('InMemoryCognitiveSearch: Shutting down...');
		this.isInitialized = false;
		console.log('InMemoryCognitiveSearch: Shutdown complete');
		return Promise.resolve();
	}

	createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
		if (this.indexes.has(indexDefinition.name)) {
			return Promise.resolve();
		}

		console.log(`Creating index: ${indexDefinition.name}`);
		this.indexes.set(indexDefinition.name, indexDefinition);
		this.documents.set(indexDefinition.name, new Map());
		return Promise.resolve();
	}

	createOrUpdateIndexDefinition(
		indexName: string,
		indexDefinition: SearchIndex,
	): Promise<void> {
		console.log(`Creating/updating index: ${indexName}`);
		this.indexes.set(indexName, indexDefinition);

		if (!this.documents.has(indexName)) {
			this.documents.set(indexName, new Map());
		}
		return Promise.resolve();
	}

	indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		if (!this.indexes.has(indexName)) {
			return Promise.reject(new Error(`Index ${indexName} does not exist`));
		}

		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			return Promise.reject(
				new Error(`Document storage not found for index ${indexName}`),
			);
		}

		const documentId = document['id'] as string;
		if (!documentId) {
			return Promise.reject(new Error('Document must have an id field'));
		}

		console.log(`Indexing document ${documentId} in index ${indexName}`);
		documentMap.set(documentId, { ...document });
		return Promise.resolve();
	}

	deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		if (!this.indexes.has(indexName)) {
			return Promise.reject(new Error(`Index ${indexName} does not exist`));
		}

		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			return Promise.reject(
				new Error(`Document storage not found for index ${indexName}`),
			);
		}

		const documentId = document['id'] as string;
		if (!documentId) {
			return Promise.reject(new Error('Document must have an id field'));
		}

		console.log(`Deleting document ${documentId} from index ${indexName}`);
		documentMap.delete(documentId);
		return Promise.resolve();
	}

	deleteIndex(indexName: string): Promise<void> {
		console.log(`Deleting index: ${indexName}`);
		this.indexes.delete(indexName);
		this.documents.delete(indexName);
		return Promise.resolve();
	}

	search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult> {
		if (!this.indexes.has(indexName)) {
			throw new Error(`Index ${indexName} does not exist`);
		}

		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			return Promise.resolve({ results: [], count: 0, facets: {} });
		}

		const indexDefinition = this.indexes.get(indexName);
		if (!indexDefinition) {
			throw new Error(`Index ${indexName} not found`);
		}
		let allDocuments = Array.from(documentMap.values());

		// Apply text search if searchText is provided
		if (searchText && searchText.trim() !== '' && searchText !== '*') {
			allDocuments = this.applyTextSearch(
				allDocuments,
				searchText,
				indexDefinition,
			);
		}

		// Apply filters if provided
		if (options?.filter) {
			allDocuments = this.applyFilters(
				allDocuments,
				options.filter,
				indexDefinition,
			);
		}

		// Apply sorting if provided
		if (options?.orderBy && options.orderBy.length > 0) {
			allDocuments = this.applySorting(allDocuments, options.orderBy);
		}

		// Apply pagination
		const skip = options?.skip || 0;
		const top = options?.top || 50;
		const totalCount = allDocuments.length;
		const paginatedResults = allDocuments.slice(skip, skip + top);

		// Convert to SearchDocumentsResult format
		const results: SearchResult[] = paginatedResults.map((doc) => ({
			document: doc,
			score: 1.0, // Mock score
		}));

		const result: SearchDocumentsResult = {
			results,
			facets: {}, // Mock implementation doesn't support faceting
		};

		if (options?.includeTotalCount) {
			result.count = totalCount;
		}

		return Promise.resolve(result);
	}

	private applyTextSearch(
		documents: Record<string, unknown>[],
		searchText: string,
		indexDefinition: SearchIndex,
	): Record<string, unknown>[] {
		const searchableFields = indexDefinition.fields
			.filter((field) => field.searchable)
			.map((field) => field.name);

		if (searchableFields.length === 0) {
			return documents;
		}

		const searchTerms = searchText.toLowerCase().split(/\s+/);

		return documents.filter((doc) => {
			return searchableFields.some((fieldName) => {
				const fieldValue = this.getFieldValue(doc, fieldName);
				if (!fieldValue) return false;

				const stringValue = String(fieldValue).toLowerCase();
				return searchTerms.some((term) => stringValue.includes(term));
			});
		});
	}

	private applyFilters(
		documents: Record<string, unknown>[],
		filterString: string,
		indexDefinition: SearchIndex,
	): Record<string, unknown>[] {
		// Basic filter implementation - only supports simple equality filters
		// Format: "fieldName eq 'value'" or "fieldName eq value"

		const filterableFields = indexDefinition.fields
			.filter((field) => field.filterable)
			.map((field) => field.name);

		// Simple regex to parse basic filters
		const filterRegex = /(\w+)\s+eq\s+['"]?([^'"]+)['"]?/g;
		const filters: Array<{ field: string; value: string }> = [];

		let match: RegExpExecArray | null = filterRegex.exec(filterString);
		while (match !== null) {
			const [, field, value] = match;
			if (field && value && filterableFields.includes(field)) {
				filters.push({ field, value });
			}
			match = filterRegex.exec(filterString);
		}

		return documents.filter((doc) => {
			return filters.every((filter) => {
				const fieldValue = this.getFieldValue(doc, filter.field);
				return String(fieldValue) === filter.value;
			});
		});
	}

	private applySorting(
		documents: Record<string, unknown>[],
		orderBy: string[],
	): Record<string, unknown>[] {
		return documents.sort((a, b) => {
			for (const sortField of orderBy) {
				const parts = sortField.split(' ');
				const fieldName = parts[0];
				const direction = parts[1] || 'asc';

				if (!fieldName) continue;

				const aValue = this.getFieldValue(a, fieldName);
				const bValue = this.getFieldValue(b, fieldName);

				let comparison = 0;
				if (typeof aValue === 'string' && typeof bValue === 'string') {
					if (aValue < bValue) comparison = -1;
					else if (aValue > bValue) comparison = 1;
				} else if (typeof aValue === 'number' && typeof bValue === 'number') {
					if (aValue < bValue) comparison = -1;
					else if (aValue > bValue) comparison = 1;
				}

				if (direction.toLowerCase() === 'desc') {
					comparison = -comparison;
				}

				if (comparison !== 0) {
					return comparison;
				}
			}
			return 0;
		});
	}

	private getFieldValue(
		document: Record<string, unknown>,
		fieldName: string,
	): unknown {
		// Handle nested field access (e.g., "user.name")
		return fieldName.split('.').reduce<unknown>((obj, key) => {
			if (obj && typeof obj === 'object' && key in obj) {
				return (obj as Record<string, unknown>)[key];
			}
			return undefined;
		}, document);
	}

	/**
	 * Debug method to inspect current state
	 */
	getDebugInfo(): {
		indexes: string[];
		documentCounts: Record<string, number>;
	} {
		const documentCounts: Record<string, number> = {};
		for (const [indexName, documentMap] of this.documents) {
			documentCounts[indexName] = documentMap.size;
		}

		return {
			indexes: Array.from(this.indexes.keys()),
			documentCounts,
		};
	}
}

export { InMemoryCognitiveSearch };
