/**
 * Test utility for generating mock authentication tokens in Storybook and test environments.
 *
 * @remarks
 * This utility is ONLY for testing and development purposes. The tokens generated are NOT
 * cryptographically secure and should NEVER be used in production code or for actual
 * authentication/authorization.
 *
 * @module test-utils/mock-token-generator
 */

/**
 * Generates a mock authentication token for testing purposes.
 *
 * @remarks
 * This function uses Math.random() which is NOT cryptographically secure. This is intentional
 * as the generated tokens are only used for:
 * - Storybook component development
 * - Unit/integration tests
 * - Local development environments
 *
 * The tokens follow the format: `mock_{timestamp}_{random}` to ensure uniqueness across
 * test runs while being easily identifiable as test data.
 *
 * @returns A mock token string in the format "mock_{timestamp}_{random}"
 *
 * @example
 * ```typescript
 * const mockToken = generateMockToken();
 * // Returns something like: "mock_l5x8k2_9j3h5k2"
 * ```
 */
// NOSONAR typescript:S2245 - Math.random() is acceptable for test mock data generation
export const generateMockToken = (): string => {
	const randomPart = Math.random().toString(36).substring(2, 15);
	const timestamp = Date.now().toString(36);
	return `mock_${timestamp}_${randomPart}`;
};
