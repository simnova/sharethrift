/**
 * This file intentionally violates the application services factory pattern.
 * It does NOT follow: (dataSources) => async (command) => result
 */

// VIOLATION: Not a curried factory pattern
export function createUserAction(command: unknown) {
	return Promise.resolve({ success: true });
}

// VIOLATION: Missing async keyword in inner function
export const createListingFactory = (dataSources: unknown) => {
	return (command: unknown) => {
		return Promise.resolve({ id: '123' });
	};
};
