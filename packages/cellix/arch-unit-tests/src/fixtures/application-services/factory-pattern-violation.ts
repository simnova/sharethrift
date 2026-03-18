// @ts-nocheck
/**
 * This file intentionally violates the application services factory pattern.
 * It does NOT follow: (dataSources) => async (command) => result
 */

// VIOLATION: Not a curried factory pattern
// biome-ignore lint/correctness/noUnusedFunctionParameters: intentional violation for testing
export function createUserAction(command: unknown) {
	return Promise.resolve({ success: true });
}

// VIOLATION: Missing async keyword in inner function
// biome-ignore lint/correctness/noUnusedFunctionParameters: intentional violation for testing
export const createListingFactory = (dataSources: unknown) => {
	// biome-ignore lint/correctness/noUnusedFunctionParameters: intentional violation for testing
	return (command: unknown) => {
		return Promise.resolve({ id: '123' });
	};
};
