// Note: Do not use inside vi.mock() calls to avoid hoisting issues.
export function makeNewableMock<TArgs extends unknown[], TResult>(
	impl: (...args: TArgs) => TResult,
) {
	// Use a normal function so it can be used as a constructor with `new`.
	// Keep the implementation minimal to match the localized helper used in tests.
	// eslint-disable-next-line func-names
	const fn = function (this: unknown, ...args: TArgs) {
		// @ts-ignore - tests expect the function to return mocked instances
		return impl(...(args as TArgs));
	} as unknown as (...args: TArgs) => TResult;

	return fn as unknown as (...args: TArgs) => TResult;
}
