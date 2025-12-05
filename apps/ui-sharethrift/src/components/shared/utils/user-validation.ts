/**
 * Utility functions for user-related validations
 */

/**
 * Validates if a userId is valid (non-empty and non-whitespace)
 * @param userId - The user ID to validate
 * @returns true if the userId is valid, false otherwise
 */
export const isValidUserId = (userId: string | undefined | null): boolean => {
	return !!userId && userId.trim() !== '';
};
