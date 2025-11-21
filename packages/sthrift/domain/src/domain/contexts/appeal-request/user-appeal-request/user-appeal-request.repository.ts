import type { UserAppealRequest } from './user-appeal-request.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';

/**
 * Repository interface for UserAppealRequest aggregate root.
 * Defines the contract for persistence and retrieval operations.
 */
export interface UserAppealRequestRepository
	extends DomainSeedwork.Repository<UserAppealRequest> {
	/**
	 * Creates a new instance of UserAppealRequest.
	 * @param userId - The ID of the user filing the appeal
	 * @param reason - The reason for the appeal
	 * @param blockerId - The ID of the admin/user who blocked the user
	 * @returns A new UserAppealRequest instance
	 */
	getNewInstance(
		userId: string,
		reason: string,
		blockerId: string,
	): Promise<UserAppealRequest>;

	/**
	 * Retrieves a UserAppealRequest by its ID.
	 * @param id - The unique identifier of the appeal request
	 * @returns The UserAppealRequest instance
	 * @throws Error if the appeal request is not found
	 */
	getById(id: string): Promise<UserAppealRequest>;
}
