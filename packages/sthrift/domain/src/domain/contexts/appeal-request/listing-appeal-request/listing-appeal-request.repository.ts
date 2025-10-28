import type { ListingAppealRequestProps } from './listing-appeal-request.entity.ts';
import type { ListingAppealRequest } from './listing-appeal-request.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

/**
 * Repository interface for ListingAppealRequest aggregate root.
 * Defines the contract for persistence and retrieval operations.
 */
export interface ListingAppealRequestRepository<
	props extends ListingAppealRequestProps,
> extends DomainSeedwork.Repository<ListingAppealRequest<props>> {
	/**
	 * Creates a new instance of ListingAppealRequest.
	 * @param userId - The ID of the user filing the appeal
	 * @param listingId - The ID of the blocked listing
	 * @param reason - The reason for the appeal
	 * @param blockerId - The ID of the admin/user who blocked the listing
	 * @returns A new ListingAppealRequest instance
	 */
	getNewInstance(
		userId: string,
		listingId: string,
		reason: string,
		blockerId: string,
	): Promise<ListingAppealRequest<props>>;

	/**
	 * Retrieves a ListingAppealRequest by its ID.
	 * @param id - The unique identifier of the appeal request
	 * @returns The ListingAppealRequest instance
	 * @throws Error if the appeal request is not found
	 */
	getById(id: string): Promise<ListingAppealRequest<props>>;
}
