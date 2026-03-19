/**
 * This file intentionally violates mongoose model conventions.
 */

// VIOLATION: Not exporting ModelFactory
export const userSchema = {
	name: String,
	email: String,
};

// VIOLATION: Not exporting ModelType
export function createModel(name: string) {
	return { name };
}

// VIOLATION: Not exporting ModelName constant
export const MODEL_COLLECTION = 'users';
