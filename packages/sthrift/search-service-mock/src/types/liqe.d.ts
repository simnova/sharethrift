/**
 * Type declarations for the 'liqe' package
 *
 * The liqe npm package does not include TypeScript type definitions,
 * so we provide minimal type declarations here for the functions we use.
 *
 * This is NOT a build artifact - it's a manually-maintained type definition.
 */
declare module 'liqe' {
	/**
	 * Parses a LiQE query string into an AST-like object that can be used with `test`.
	 */
	export function parse(query: string): unknown;

	/**
	 * Evaluates a parsed LiQE query against a plain JSON document.
	 */
	export function test(
		parsedQuery: unknown,
		document: Record<string, unknown>,
	): boolean;
}
