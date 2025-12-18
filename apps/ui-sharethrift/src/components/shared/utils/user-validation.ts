/**
 * Utility functions for user-related validations
 */

/**
 * Checks if a userId string is present and non-empty.
 * This is a basic check for routing purposes - it does not validate the format or existence
 * of the user in the database. Invalid IDs are handled gracefully by the GraphQL layer.
 * @param userId - The user ID to check
 * @returns true if the userId is a non-empty string, false otherwise
 */
export const isValidUserId = (userId: string | undefined | null): boolean => {
	return !!userId && userId.trim() !== '';
};
