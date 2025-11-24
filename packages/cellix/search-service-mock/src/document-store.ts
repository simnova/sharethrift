/**
 * Document Store
 *
 * Manages document storage for search indexes.
 * Provides a clean interface for document CRUD operations.
 */
export class DocumentStore {
	private documents: Map<string, Map<string, Record<string, unknown>>> =
		new Map();

	/**
	 * Check if a document store exists for an index
	 *
	 * @param indexName - The name of the index
	 * @returns True if the document store exists, false otherwise
	 */
	has(indexName: string): boolean {
		return this.documents.has(indexName);
	}

	/**
	 * Create a new document store for an index
	 *
	 * @param indexName - The name of the index
	 */
	create(indexName: string): void {
		if (!this.documents.has(indexName)) {
			this.documents.set(indexName, new Map());
		}
	}

	/**
	 * Get the document store for an index
	 *
	 * @param indexName - The name of the index
	 * @returns The document map or undefined if not found
	 */
	getDocs(indexName: string): Map<string, Record<string, unknown>> {
		return this.documents.get(indexName) ?? new Map();
	}

	/**
	 * Add or update a document
	 *
	 * @param indexName - The name of the index
	 * @param documentId - The ID of the document
	 * @param document - The document to store
	 */
	set(
		indexName: string,
		documentId: string,
		document: Record<string, unknown>,
	): void {
		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			throw new Error(`Document store not found for index ${indexName}`);
		}
		documentMap.set(documentId, document);
	}

	/**
	 * Get a document by ID
	 *
	 * @param indexName - The name of the index
	 * @param documentId - The ID of the document
	 * @returns The document or undefined if not found
	 */
	get(
		indexName: string,
		documentId: string,
	): Record<string, unknown> | undefined {
		const documentMap = this.documents.get(indexName);
		return documentMap?.get(documentId);
	}

	/**
	 * Delete a document
	 *
	 * @param indexName - The name of the index
	 * @param documentId - The ID of the document to delete
	 * @returns True if the document was deleted, false if not found
	 */
	delete(indexName: string, documentId: string): boolean {
		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			return false;
		}
		return documentMap.delete(documentId);
	}

	/**
	 * Delete the document store for an index
	 *
	 * @param indexName - The name of the index
	 */
	deleteStore(indexName: string): void {
		this.documents.delete(indexName);
	}

	/**
	 * Get the count of documents in an index
	 *
	 * @param indexName - The name of the index
	 * @returns The number of documents or 0 if the store doesn't exist
	 */
	getCount(indexName: string): number {
		const documentMap = this.documents.get(indexName);
		return documentMap?.size ?? 0;
	}

	/**
	 * Get all document counts for all indexes
	 *
	 * @returns Record mapping index names to document counts
	 */
	getAllCounts(): Record<string, number> {
		const counts: Record<string, number> = {};
		for (const [indexName, documentMap] of this.documents) {
			counts[indexName] = documentMap.size;
		}
		return counts;
	}
}

