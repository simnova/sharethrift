import type { ListingDeletionConfig } from '@sthrift/context-spec';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { deleteByListing as deleteConversationsByListing } from '../../conversation/conversation/delete-by-listing.ts';

type BlobStorageService = Domain.Services['BlobStorage'];

export interface ProcessExpiredDeletionsResult {
	deletedCount: number;
	deletedListingIds: string[];
	deletedConversationsCount: number;
	deletedImagesCount: number;
	errors: Array<{ listingId: string; error: string }>;
}

async function deleteListingImages(
	blobStorage: BlobStorageService,
	images: string[],
	containerName: string,
): Promise<number> {
	let deletedCount = 0;
	// Process all images concurrently (unbounded parallelism) for maximum throughput
	const imagePromises = images.map((imagePath) =>
		blobStorage
			.deleteBlob(containerName, imagePath)
			.then(() => ({ success: true as const, imagePath }))
			.catch((error) => ({
				success: false as const,
				imagePath,
				error: error instanceof Error ? error.message : String(error),
			})),
	);

	const results = await Promise.allSettled(imagePromises);
	for (const result of results) {
		if (result.status === 'fulfilled') {
			if (result.value.success) {
				deletedCount++;
			} else {
				console.warn(
					`[ExpiredDeletion] Failed to delete image ${result.value.imagePath}: ${result.value.error}`,
				);
			}
		}
	}
	return deletedCount;
}

async function deleteListingById(
	uow: DataSources['domainDataSource']['Listing']['ItemListing']['ItemListingUnitOfWork'],
	listingId: string,
): Promise<void> {
	await uow.withScopedTransaction(async (repo) => {
		const domainListing = await repo.get(listingId);
		domainListing.requestDelete();
		await repo.save(domainListing);
	});
}

export const processExpiredDeletions = (
	dataSources: DataSources,
	config: ListingDeletionConfig,
	blobStorage?: BlobStorageService,
): (() => Promise<ProcessExpiredDeletionsResult>) => {
	return async (): Promise<ProcessExpiredDeletionsResult> => {
		const result: ProcessExpiredDeletionsResult = {
			deletedCount: 0,
			deletedListingIds: [],
			deletedConversationsCount: 0,
			deletedImagesCount: 0,
			errors: [],
		};

		const expiredListings =
			await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getExpiredForDeletion(
				config.archivalMonths,
				config.batchSize,
			);

		console.log(
			`[ExpiredDeletion] Found ${expiredListings.length} listings eligible for deletion`,
		);

		if (expiredListings.length === 0) {
			return result;
		}

		const uow =
			dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
		const deleteConversations = deleteConversationsByListing(dataSources);

		for (const listing of expiredListings) {
			const listingId = listing.id;

			try {
				if (blobStorage && listing.images && listing.images.length > 0) {
					const imagesDeleted = await deleteListingImages(
						blobStorage,
						listing.images,
						config.blobContainerName,
					);
					result.deletedImagesCount += imagesDeleted;
					console.log(
						`[ExpiredDeletion] Deleted ${imagesDeleted} images for listing ${listingId}`,
					);
				}

				const conversationResult = await deleteConversations(listingId);
				result.deletedConversationsCount += conversationResult.deletedCount;
				if (conversationResult.errors.length > 0) {
					console.warn(
						`[ExpiredDeletion] Errors deleting conversations for listing ${listingId}: ${JSON.stringify(conversationResult.errors)}`,
					);
				}

				await deleteListingById(uow, listingId);
				result.deletedCount++;
				result.deletedListingIds.push(listingId);
				console.log(`[ExpiredDeletion] Deleted listing: ${listingId}`);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				result.errors.push({ listingId, error: errorMessage });
				console.error(
					`[ExpiredDeletion] Failed to delete listing ${listingId}: ${errorMessage}`,
				);
			}
		}

		console.log(
			`[ExpiredDeletion] Completed: ${result.deletedCount} listings deleted, ${result.deletedConversationsCount} conversations deleted, ${result.deletedImagesCount} images deleted, ${result.errors.length} errors`,
		);

		return result;
	};
};
