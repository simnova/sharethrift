import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { deleteByListing as deleteConversationsByListing } from '../../conversation/conversation/delete-by-listing.ts';

const ARCHIVAL_MONTHS = 6;
const BATCH_SIZE = 100;
const BLOB_CONTAINER_NAME = 'listing-images';

export interface ProcessExpiredDeletionsResult {
	deletedCount: number;
	deletedListingIds: string[];
	deletedConversationsCount: number;
	deletedImagesCount: number;
	errors: Array<{ listingId: string; error: string }>;
}

async function deleteListingImages(
	blobStorage: Domain.Services['BlobStorage'],
	images: string[],
): Promise<number> {
	let deletedCount = 0;
	for (const imagePath of images) {
		try {
			await blobStorage.deleteBlob(BLOB_CONTAINER_NAME, imagePath);
			deletedCount++;
		} catch (error) {
			console.warn(`[ExpiredDeletion] Failed to delete image ${imagePath}: ${error instanceof Error ? error.message : String(error)}`);
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
	blobStorage?: Domain.Services['BlobStorage'],
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
				ARCHIVAL_MONTHS,
				BATCH_SIZE,
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
					const imagesDeleted = await deleteListingImages(blobStorage, listing.images);
					result.deletedImagesCount += imagesDeleted;
					console.log(`[ExpiredDeletion] Deleted ${imagesDeleted} images for listing ${listingId}`);
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