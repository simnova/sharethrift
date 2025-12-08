/**
 * Generates a unique mock token for testing purposes.
 * Uses timestamp and random characters to ensure uniqueness across test runs.
 *
 * @returns A mock token string in the format `mock_{timestamp}_{random}`
 */
export const generateMockToken = (): string => {
	const randomPart = Math.random().toString(36).substring(2, 15);
	const timestamp = Date.now().toString(36);
	return `mock_${timestamp}_${randomPart}`;
};
