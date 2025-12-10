import type { CognitiveSearchDomain } from '../../infrastructure/cognitive-search/index.js';
import type { ItemListingUnitOfWork } from '../../contexts/listing/item/item-listing.uow.js';
import {
	ItemListingSearchIndexSpec,
	convertItemListingToSearchDocument,
} from '../../infrastructure/cognitive-search/item-listing-search-index.js';
import crypto from 'node:crypto';

export class ItemListingSearchIndexingService {
	constructor(
		searchService: CognitiveSearchDomain,
		itemListingUnitOfWork: ItemListingUnitOfWork,
	) {
		this.searchService = searchService;
		this.itemListingUnitOfWork = itemListingUnitOfWork;
	}

	private readonly searchService: CognitiveSearchDomain;
	private readonly itemListingUnitOfWork: ItemListingUnitOfWork;

	async indexItemListing(itemListingId: string): Promise<void> {
		await this.itemListingUnitOfWork.withScopedTransaction(
			async (repo) => {
				const itemListing = await repo.getById(itemListingId);
				if (!itemListing) {
					console.warn(`ItemListing ${itemListingId} not found, skipping search index update`);
					return;
				}

				const searchDocument = convertItemListingToSearchDocument(itemListing as unknown as Record<string, unknown>);
				await this.updateSearchIndexWithRetry(searchDocument, itemListing as unknown as Record<string, unknown>, 3);
			},
		);
	}

	async deleteFromIndex(itemListingId: string): Promise<void> {
		await this.searchService.createIndexIfNotExists(ItemListingSearchIndexSpec);
		await this.searchService.deleteDocument(
			ItemListingSearchIndexSpec.name,
			{ id: itemListingId } as Record<string, unknown>,
		);
	}

	private async updateSearchIndexWithRetry(
		searchDocument: Record<string, unknown>,
		itemListing: Record<string, unknown>,
		maxAttempts: number,
	): Promise<void> {
		await this.searchService.createIndexIfNotExists(ItemListingSearchIndexSpec);

		const currentHash = this.calculateHash(searchDocument);
		const existingHash = itemListing.searchHash as string | undefined;

		if (currentHash === existingHash) {
			console.log('Search document unchanged, skipping index update');
			return;
		}

		let lastError: Error | undefined;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				await this.searchService.indexDocument(
					ItemListingSearchIndexSpec.name,
					searchDocument,
				);
				return;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));
				if (attempt < maxAttempts) {
					const delay = 2 ** attempt * 100;
					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
		}

		throw new Error(
			`Failed to index document after ${maxAttempts} attempts: ${lastError?.message}`,
		);
	}

	private calculateHash(doc: Record<string, unknown>): string {
		const sortedKeys = Object.keys(doc).sort((a, b) => a.localeCompare(b));
		const normalized = JSON.stringify(doc, sortedKeys);
		return crypto.createHash('sha256').update(normalized).digest('hex');
	}
}
