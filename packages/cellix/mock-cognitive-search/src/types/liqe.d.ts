declare module 'liqe' {
	/**
	 * Parses a LiQE query string into an AST-like object that can be used with `test`.
	 */
	export function parse(query: string): unknown;

	/**
	 * Evaluates a parsed LiQE query against a plain JSON document.
	 */
	export function test(parsedQuery: unknown, document: Record<string, unknown>): boolean;
}


