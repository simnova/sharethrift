/**
 * Helper to create validated string accessors for admin user entities.
 * Reduces boilerplate code for simple getter/setter patterns with visa validation.
 *
 * @param target - The entity instance
 * @param validateFn - The validation function to call before setting
 * @param propertyNames - Array of property names to create accessors for
 */
export function createValidatedStringAccessors<
	T extends Record<string, string | null | undefined>,
>(
	// biome-ignore lint/suspicious/noExplicitAny: Need to accept protected props from ValueObject
	target: any,
	validateFn: () => void,
	propertyNames: (keyof T)[],
): void {
	for (const prop of propertyNames) {
		Object.defineProperty(target, prop, {
			get(): string | null | undefined {
				return (target as { props: T }).props[prop];
			},
			set(value: string | null) {
				validateFn();
				(target as { props: T }).props[prop] = value as T[keyof T];
			},
			enumerable: true,
			configurable: true,
		});
	}
}
