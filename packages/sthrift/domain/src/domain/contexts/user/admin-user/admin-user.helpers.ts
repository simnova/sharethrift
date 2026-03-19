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
