import lunr from 'lunr';
import type {
	SearchField,
	SearchOptions,
	SearchDocumentsResult,
	SearchResult,
} from './interfaces.js';
import { LiQEFilterEngine } from './liqe-filter-engine.js';

/**
 * Lunr.js Search Engine Wrapper with LiQE Integration
 *
 * Provides enhanced full-text search capabilities with:
 * - Relevance scoring based on TF-IDF
 * - Field boosting (title gets higher weight than description)
 * - Stemming and stop word filtering
 * - Fuzzy matching and wildcard support
 * - Multi-field search across all searchable fields
 * - Advanced OData-like filtering via LiQE integration
 *
 * This class encapsulates the Lunr.js functionality and provides a clean interface
 * for building and querying search indexes with Azure Cognitive Search compatibility.
 * Enhanced with LiQE for sophisticated filtering capabilities.
 */
export class LunrSearchEngine {
	private indexes: Map<string, lunr.Index> = new Map();
	private documents: Map<string, Map<string, Record<string, unknown>>> =
		new Map();
	private indexDefinitions: Map<string, { fields: SearchField[] }> = new Map();
	private liqeFilterEngine: LiQEFilterEngine;

	constructor() {
		this.liqeFilterEngine = new LiQEFilterEngine();
	}

	/**
	 * Build a Lunr.js index for the given index name
	 *
	 * @param indexName - The name of the search index to build
	 * @param fields - Array of search field definitions with their capabilities
	 * @param documents - Array of documents to index initially
	 */
	buildIndex(
		indexName: string,
		fields: SearchField[],
		documents: Record<string, unknown>[],
	): void {
		// Store the index definition for later reference
		this.indexDefinitions.set(indexName, { fields });

		// Store documents for retrieval
		const documentMap = new Map<string, Record<string, unknown>>();
		documents.forEach((doc) => {
			const docId = doc['id'] as string;
			if (docId) {
				documentMap.set(docId, doc);
			}
		});
		this.documents.set(indexName, documentMap);

		// Build Lunr index
		const idx = (lunr as unknown as typeof lunr)(function (this: lunr.Builder) {
			// Set the reference field (unique identifier)
			this.ref('id');

			// Add fields with boosting
			fields.forEach((field) => {
				if (field.searchable && field.type === 'Edm.String') {
					// Boost title field significantly more than others
					const boost =
						field.name === 'title' ? 10 : field.name === 'description' ? 2 : 1;
					this.field(field.name, { boost });
				}
			});

			// Add all documents to the index
			documents.forEach((doc) => {
				this.add(doc);
			});
		});

		this.indexes.set(indexName, idx);
	}

	/**
	 * Rebuild the index for an index name (used when documents are updated)
	 *
	 * @param indexName - The name of the index to rebuild
	 */
	rebuildIndex(indexName: string): void {
		const documentMap = this.documents.get(indexName);
		const indexDef = this.indexDefinitions.get(indexName);

		if (!documentMap || !indexDef) {
			console.warn(
				`Cannot rebuild index ${indexName}: missing documents or definition`,
			);
			return;
		}

		const documents = Array.from(documentMap.values());
		this.buildIndex(indexName, indexDef.fields, documents);
	}

	/**
	 * Add a document to an existing index
	 *
	 * @param indexName - The name of the index to add the document to
	 * @param document - The document to add to the index
	 */
	addDocument(indexName: string, document: Record<string, unknown>): void {
		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			console.warn(`Cannot add document to ${indexName}: index not found`);
			return;
		}

		const docId = document['id'] as string;
		if (!docId) {
			console.warn('Document must have an id field');
			return;
		}

		documentMap.set(docId, document);
		this.rebuildIndex(indexName);
	}

	/**
	 * Remove a document from an index
	 *
	 * @param indexName - The name of the index to remove the document from
	 * @param documentId - The ID of the document to remove
	 */
	removeDocument(indexName: string, documentId: string): void {
		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			console.warn(`Cannot remove document from ${indexName}: index not found`);
			return;
		}

		documentMap.delete(documentId);
		this.rebuildIndex(indexName);
	}

	/**
	 * Search using Lunr.js with enhanced query processing
	 *
	 * @param indexName - The name of the index to search
	 * @param searchText - The search query text
	 * @param options - Optional search parameters (filters, pagination, facets, etc.)
	 * @returns Search results with relevance scoring and facets
	 */
	search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): SearchDocumentsResult {
		const idx = this.indexes.get(indexName);
		const documentMap = this.documents.get(indexName);

		if (!idx || !documentMap) {
			return { results: [], count: 0, facets: {} };
		}

		// Handle empty search - return all documents if no search text
		if (!searchText || searchText.trim() === '' || searchText === '*') {
			const allDocuments = Array.from(documentMap.values());

			// Apply LiQE filters if provided, even for empty search
			let filteredDocuments = allDocuments;
			if (options?.filter) {
				const searchResults = allDocuments.map((doc) => ({
					document: doc,
					score: 1.0,
				}));
				const filteredResults = this.liqeFilterEngine.applyAdvancedFilter(
					searchResults,
					options.filter,
				);
				filteredDocuments = filteredResults.map((result) => result.document);
			}

			const results = this.applyPaginationAndSorting(
				filteredDocuments,
				options,
			);

			// Process facets if requested
			const facets =
				options?.facets && options.facets.length > 0
					? this.processFacets(
							filteredDocuments.map((doc) => ({ document: doc, score: 1.0 })),
							options.facets,
						)
					: {};

			const result: SearchDocumentsResult = {
				results: results.map((doc) => ({ document: doc, score: 1.0 })),
				facets,
				count: filteredDocuments.length, // Always include count for empty searches
			};

			return result;
		}

		// Process search query with enhanced features
		const processedQuery = this.processSearchQuery(searchText);

		try {
			// Execute Lunr search - handle both simple text and wildcard queries
			let lunrResults: lunr.Index.Result[];
			if (searchText.includes('*')) {
				// For wildcard queries, use the original text without processing
				lunrResults = idx.search(searchText);
			} else {
				lunrResults = idx.search(processedQuery);
			}

			// Convert Lunr results to our format
			const searchResults: (SearchResult | null)[] = lunrResults.map(
				(result: lunr.Index.Result) => {
					const document = documentMap.get(result.ref);
					return document
						? {
								document,
								score: result.score,
							}
						: null;
				},
			);

			const results: SearchResult[] = searchResults.filter(
				(result): result is SearchResult => result !== null,
			);

			// Apply additional filters if provided using LiQE for advanced filtering
			const filteredResults = options?.filter
				? this.liqeFilterEngine.applyAdvancedFilter(results, options.filter)
				: results;

			// Apply sorting, pagination, and facets
			const finalResults = this.processFacetsAndPagination(
				filteredResults,
				options,
			);

			return finalResults;
		} catch (error) {
			console.warn(`Lunr search failed for query "${searchText}":`, error);
			// Fallback to empty results for malformed queries
			return { results: [], count: 0, facets: {} };
		}
	}

	/**
	 * Process search query to add fuzzy matching and wildcard support
	 *
	 * @param searchText - The original search text
	 * @returns Processed search text with wildcards and fuzzy matching
	 * @private
	 */
	private processSearchQuery(searchText: string): string {
		// If query already contains wildcards or fuzzy operators, use as-is
		if (searchText.includes('*') || searchText.includes('~')) {
			return searchText;
		}

		// For simple queries, add wildcard for prefix matching
		// This helps with partial word matches
		return `${searchText}*`;
	}

	/**
	 * Apply facets, sorting, and pagination
	 */
	private processFacetsAndPagination(
		results: SearchResult[],
		options?: SearchOptions,
	): SearchDocumentsResult {
		// Apply sorting if provided (default to relevance score descending)
		let sortedResults;
		if (options?.orderBy && options.orderBy.length > 0) {
			sortedResults = this.applySorting(results, options.orderBy);
		} else {
			// Default sort by relevance score (descending)
			sortedResults = results.sort((a, b) => (b.score || 0) - (a.score || 0));
		}

		// Apply pagination
		const skip = options?.skip || 0;
		const top = options?.top || 50;
		const totalCount = sortedResults.length;
		const paginatedResults = sortedResults.slice(skip, skip + top);

		// Process facets if requested
		const facets =
			options?.facets && options.facets.length > 0
				? this.processFacets(sortedResults, options.facets)
				: {};

		const result: SearchDocumentsResult = {
			results: paginatedResults,
			facets,
			count: totalCount, // Always include count for consistency
		};

		return result;
	}

	/**
	 * Apply sorting to results
	 */
	private applySorting(
		results: SearchResult[],
		orderBy: string[],
	): SearchResult[] {
		return results.sort((a, b) => {
			for (const sortField of orderBy) {
				const parts = sortField.split(' ');
				const fieldName = parts[0];
				const direction = parts[1] || 'asc';

				if (!fieldName) continue;

				const aValue = this.getFieldValue(a.document, fieldName);
				const bValue = this.getFieldValue(b.document, fieldName);

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

	/**
	 * Process facets for the results
	 */
	private processFacets(
		results: SearchResult[],
		facetFields: string[],
	): Record<
		string,
		Array<{ value: string | number | boolean; count: number }>
	> {
		const facets: Record<
			string,
			Array<{ value: string | number | boolean; count: number }>
		> = {};

		facetFields.forEach((fieldName) => {
			const valueCounts = new Map<string | number | boolean, number>();

			results.forEach((result) => {
				const fieldValue = this.getFieldValue(result.document, fieldName);
				if (fieldValue !== undefined && fieldValue !== null) {
					const value = fieldValue as string | number | boolean;
					valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
				}
			});

			facets[fieldName] = Array.from(valueCounts.entries())
				.map(([value, count]) => ({ value, count }))
				.sort((a, b) => b.count - a.count);
		});

		return facets;
	}

	/**
	 * Apply pagination and sorting to documents (for empty search)
	 */
	private applyPaginationAndSorting(
		documents: Record<string, unknown>[],
		options?: SearchOptions,
	): Record<string, unknown>[] {
		let sortedDocs = documents;

		if (options?.orderBy && options.orderBy.length > 0) {
			sortedDocs = documents.sort((a, b) => {
				for (const sortField of options.orderBy ?? []) {
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

		// Apply pagination
		const skip = options?.skip || 0;
		const top = options?.top || 50;
		return sortedDocs.slice(skip, skip + top);
	}

	/**
	 * Get field value from document (supports nested field access)
	 */
	private getFieldValue(
		document: Record<string, unknown>,
		fieldName: string,
	): unknown {
		return fieldName.split('.').reduce<unknown>((obj, key) => {
			if (obj && typeof obj === 'object' && key in obj) {
				return (obj as Record<string, unknown>)[key];
			}
			return undefined;
		}, document);
	}

	/**
	 * Check if an index exists
	 *
	 * @param indexName - The name of the index to check
	 * @returns True if the index exists, false otherwise
	 */
	hasIndex(indexName: string): boolean {
		return this.indexes.has(indexName);
	}

	/**
	 * Get index statistics for debugging and monitoring
	 *
	 * @param indexName - The name of the index to get statistics for
	 * @returns Statistics object with document count and field count, or null if index doesn't exist
	 */
	getIndexStats(
		indexName: string,
	): { documentCount: number; fieldCount: number } | null {
		const documentMap = this.documents.get(indexName);
		const indexDef = this.indexDefinitions.get(indexName);

		if (!documentMap || !indexDef) {
			return null;
		}

		return {
			documentCount: documentMap.size,
			fieldCount: indexDef.fields.length,
		};
	}

	/**
	 * Get information about supported LiQE filter capabilities
	 *
	 * @returns Object containing supported operators, functions, and examples
	 */
	getFilterCapabilities(): {
		operators: string[];
		functions: string[];
		examples: string[];
	} {
		return this.liqeFilterEngine.getSupportedFeatures();
	}

	/**
	 * Validate if a filter string is supported by LiQE
	 *
	 * @param filterString - Filter string to validate
	 * @returns True if the filter can be parsed by LiQE, false otherwise
	 */
	isFilterSupported(filterString: string): boolean {
		return this.liqeFilterEngine.isFilterSupported(filterString);
	}
}

