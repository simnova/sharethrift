import type { SearchIndex } from './interfaces.js';

/**
 * Index Manager
 *
 * Manages search index definitions and lifecycle operations.
 * Provides a clean interface for index creation, updates, and deletion.
 */
export class IndexManager {
	private indexes: Map<string, SearchIndex> = new Map();

	/**
	 * Check if an index exists
	 *
	 * @param indexName - The name of the index to check
	 * @returns True if the index exists, false otherwise
	 */
	has(indexName: string): boolean {
		return this.indexes.has(indexName);
	}

	/**
	 * Create a new index
	 *
	 * @param indexDefinition - The definition of the index to create
	 */
	create(indexDefinition: SearchIndex): void {
		this.indexes.set(indexDefinition.name, indexDefinition);
	}

	/**
	 * Get an index definition
	 *
	 * @param indexName - The name of the index to get
	 * @returns The index definition or undefined if not found
	 */
	get(indexName: string): SearchIndex | undefined {
		return this.indexes.get(indexName);
	}

	/**
	 * Delete an index
	 *
	 * @param indexName - The name of the index to delete
	 */
	delete(indexName: string): void {
		this.indexes.delete(indexName);
	}

	/**
	 * List all index names
	 *
	 * @returns Array of index names
	 */
	listIndexes(): string[] {
		return Array.from(this.indexes.keys());
	}

	/**
	 * Get all index definitions
	 *
	 * @returns Map of index names to index definitions
	 */
	getAll(): Map<string, SearchIndex> {
		return new Map(this.indexes);
	}
}

