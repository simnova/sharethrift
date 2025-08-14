import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { UserDomainPermissions } from './user.domain-permissions.ts';

/**
 * Visa interface for the User bounded context.
 * Provides authorization checks using user domain permissions.
 */
export interface UserVisa extends PassportSeedwork.Visa<UserDomainPermissions> {
	/**
	 * Determines if the current user has the specified permissions.
	 * @param func Predicate function to evaluate permissions
	 * @returns true if the user has the required permissions
	 */
	determineIf(
		func: (permissions: Readonly<UserDomainPermissions>) => boolean,
	): boolean;
}