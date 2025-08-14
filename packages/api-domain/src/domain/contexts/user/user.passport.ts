import type { UserVisa } from './user.visa.ts';
import type { UserEntityReference } from './user/user.aggregate.ts';

/**
 * Passport interface for the User bounded context.
 * Provides context-aware visa creation for user aggregates.
 */
export interface UserPassport {
	/**
	 * Creates a visa for a specific user aggregate.
	 * @param root User aggregate entity reference
	 * @returns UserVisa instance with appropriate permissions
	 */
	forUser(root: UserEntityReference): UserVisa;
}