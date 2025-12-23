import type { CognitiveSearchDomain } from '../../infrastructure/cognitive-search/index.js';
import type { ItemListingUnitOfWork } from '../../contexts/listing/item/item-listing.uow.js';
import {
	ListingSearchIndexSpec,
	convertListingToSearchDocument,
} from '../../infrastructure/cognitive-search/listing-search-index.js';
import crypto from 'node:crypto';

export class ListingSearchIndexingService {
	constructor(
		searchService: CognitiveSearchDomain,
		itemListingUnitOfWork: ItemListingUnitOfWork,
	) {
		this.searchService = searchService;
		this.itemListingUnitOfWork = itemListingUnitOfWork;
	}

	private readonly searchService: CognitiveSearchDomain;
	private readonly itemListingUnitOfWork: ItemListingUnitOfWork;

	async indexListing(listingId: string): Promise<void> {
		await this.itemListingUnitOfWork.withScopedTransaction(
			async (repo) => {
				const listing = await repo.getById(listingId);
				if (!listing) {
					console.warn(`Listing ${listingId} not found, skipping search index update`);
					return;
				}

				const searchDocument = convertListingToSearchDocument(listing as unknown as Record<string, unknown>);
				await this.updateSearchIndexWithRetry(searchDocument, listing as unknown as Record<string, unknown>, 3);
			},
		);
	}

	async deleteFromIndex(listingId: string): Promise<void> {
		await this.searchService.createIndexIfNotExists(ListingSearchIndexSpec);
		await this.searchService.deleteDocument(
			ListingSearchIndexSpec.name,
			{ id: listingId } as Record<string, unknown>,
		);
	}

	private async updateSearchIndexWithRetry(
		searchDocument: Record<string, unknown>,
		listing: Record<string, unknown>,
		maxAttempts: number,
	): Promise<void> {
		await this.searchService.createIndexIfNotExists(ListingSearchIndexSpec);

		const currentHash = this.calculateHash(searchDocument);
		const existingHash = listing.searchHash as string | undefined;

		if (currentHash === existingHash) {
			return;
		}

		let lastError: Error | undefined;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				await this.searchService.indexDocument(
					ListingSearchIndexSpec.name,
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
