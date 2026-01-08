/**
 * Formats a user display name from their profile information.
 * Prioritizes first/last name combination, falls back to username, then to a default.
 *
 * @param user - User object with firstName, lastName, and username
 * @returns Formatted display name
 */
export function getUserDisplayName(user: {
	firstName?: string | null;
	lastName?: string | null;
	username?: string | null;
}): string {
	const nameParts = [user.firstName, user.lastName].filter(
		(part) => Boolean(part) && part !== "N/A",
	);

	if (nameParts.length > 0) {
		return nameParts.join(" ");
	}

	return user.username || "Listing User";
}
