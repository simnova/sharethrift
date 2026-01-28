/**
 * Shared helper utilities for user domain adapters.
 * Reduces boilerplate code for simple getter/setter patterns in adapter classes.
 */

/**
 * Creates string accessors for adapter classes that wrap Mongoose subdocuments.
 *
 * @param target - The adapter instance
 * @param propertyNames - Array of property names to create accessors for
 */
export function createStringAccessors<
	T extends Record<string, string | null | undefined>,
>(
	// biome-ignore lint/suspicious/noExplicitAny: Need to accept various adapter implementations
	target: any,
	propertyNames: (keyof T)[],
): void {
	for (const prop of propertyNames) {
		Object.defineProperty(target, prop, {
			get(): string | null | undefined {
				return target.props[prop];
			},
			set(value: string | null) {
				target.props[prop] = value;
			},
			enumerable: true,
			configurable: true,
		});
	}
}
