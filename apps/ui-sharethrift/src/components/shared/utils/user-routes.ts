/**
 * Centralized route helper functions for user-related navigation.
 * These functions ensure consistency across the application and make it easier
 * to update routes if the URL structure changes in the future.
 */

/**
 * Generates the path to a user's profile page
 * @param userId - The unique identifier for the user (ObjectID)
 * @returns The path to the user's profile (e.g., "/user/507f1f77bcf86cd799439011")
 */
export const getUserProfilePath = (userId: string): string => {
	return `/user/${userId}`;
};
