/**
 * Generates a unique mock token for testing purposes.
 * Uses timestamp and random characters to ensure uniqueness across test runs.
 *
 * Security Note: Math.random() is intentionally used here as this is a test utility
 * for generating non-sensitive mock tokens. This PRNG is NOT suitable for cryptographic
 * purposes, but is perfectly safe for test data generation where security is not required.
 *
 * @returns A mock token string in the format `mock_{timestamp}_{random}`
 */
export const generateMockToken = (): string => {
	// Safe to use Math.random() for test mock tokens (not cryptographically secure, but not needed for tests)
	const randomPart = Math.random().toString(36).substring(2, 15);
	const timestamp = Date.now().toString(36);
	return `mock_${timestamp}_${randomPart}`;
};
