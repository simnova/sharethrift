/**
 * LiQE Filter Engine for Advanced OData-like Filtering
 *
 * Provides advanced filtering capabilities using LiQE (Lucene-like Query Engine)
 * to support complex OData-style filter expressions including:
 * - Comparison operators (eq, ne, gt, lt, ge, le)
 * - Logical operators (and, or)
 * - String functions (contains, startswith, endswith)
 * - Complex nested expressions
 *
 * This engine enhances the mock cognitive search with sophisticated filtering
 * that closely matches Azure Cognitive Search OData filter capabilities.
 *
 * OData to LiQE syntax mapping:
 * - "field eq 'value'" -> "field:value"
 * - "field ne 'value'" -> "NOT field:value"
 * - "field gt 100" -> "field:>100"
 * - "field lt 100" -> "field:<100"
 * - "field ge 100" -> "field:>=100"
 * - "field le 100" -> "field:<=100"
 * - "field and field2" -> "field AND field2"
 * - "field or field2" -> "field OR field2"
 * - "contains(field, 'text')" -> "field:*text*"
 * - "startswith(field, 'text')" -> "field:text*"
 * - "endswith(field, 'text')" -> "field:*text"
 *
 * Security Note: All regex patterns in this file are designed to be safe from
 * catastrophic backtracking (ReDoS). We use:
 * - Negated character classes instead of .*
 * - String methods (split, indexOf) instead of complex regex where possible
 * - Input length limits to prevent DoS
 */

import { parse, test } from 'liqe';
import type { SearchResult } from './interfaces.js';

/** Maximum allowed filter string length to prevent DoS */
const MAX_FILTER_LENGTH = 2048;

/**
 * LiQE Filter Engine for advanced OData-like filtering
 *
 * This class provides sophisticated filtering capabilities using LiQE to parse
 * and execute complex filter expressions that match Azure Cognitive Search
 * OData filter syntax patterns.
 */
export class LiQEFilterEngine {
	/**
	 * Apply advanced filtering using LiQE to parse and execute filter expressions
	 *
	 * @param results - Array of search results to filter
	 * @param filterString - OData-style filter string to parse and apply
	 * @returns Filtered array of search results
	 */
	applyAdvancedFilter(
		results: SearchResult[],
		filterString: string,
	): SearchResult[] {
		if (!filterString || filterString.trim() === '') {
			return results;
		}

		// Safety: cap input size to avoid expensive parsing on untrusted input
		if (filterString.length > MAX_FILTER_LENGTH) {
			console.warn('Filter string too long; skipping filter for safety.');
			return results;
		}

		try {
			// Convert OData syntax to LiQE syntax
			const liqeQuery = this.convertODataToLiQE(filterString);

			// Parse the converted filter string using LiQE
			const parsedQuery = parse(liqeQuery);

			// Filter results using LiQE's test function
			return results.filter((result) => {
				return test(parsedQuery, result.document);
			});
		} catch (error) {
			console.warn(`LiQE filter parsing failed for "${filterString}":`, error);
			// Fallback to basic filtering for malformed queries
			return this.applyBasicFilter(results, filterString);
		}
	}

	/**
	 * Apply basic OData-style filtering as fallback for unsupported expressions
	 *
	 * @param results - Array of search results to filter
	 * @param filterString - Basic filter string to apply
	 * @returns Filtered array of search results
	 * @private
	 */
	private applyBasicFilter(
		results: SearchResult[],
		filterString: string,
	): SearchResult[] {
		// Safety: cap input size to avoid expensive parsing on untrusted input
		if (filterString.length > MAX_FILTER_LENGTH) {
			console.warn('Filter string too long; skipping basic filter for safety.');
			return results;
		}

		// Linear-time parse for basic patterns like: "field eq 'value'" joined by "and"
		// Uses string methods instead of regex to avoid ReDoS
		const filters: Array<{ field: string; value: string }> = [];
		const parts = this.splitByKeyword(filterString.trim(), ' and ');

		for (const rawPart of parts) {
			const part = rawPart.trim();
			const eqIndex = part.toLowerCase().indexOf(' eq ');
			if (eqIndex === -1) continue;

			const field = part.slice(0, eqIndex).trim();
			let value = part.slice(eqIndex + 4).trim(); // after ' eq '
			if (!field || value.length === 0) continue;

			// Strip one pair of surrounding quotes if present
			if (
				(value.startsWith("'") && value.endsWith("'")) ||
				(value.startsWith('"') && value.endsWith('"'))
			) {
				value = value.slice(1, -1);
			}

			// Skip if internal quotes remain to keep parsing simple and safe
			if (value.includes("'") || value.includes('"')) continue;

			filters.push({ field, value });
		}

		return results.filter((result) => {
			return filters.every((filter) => {
				const fieldValue = this.getFieldValue(result.document, filter.field);
				return String(fieldValue) === filter.value;
			});
		});
	}

	/**
	 * Split string by keyword (case-insensitive) without using regex
	 * This is a safe alternative to split(/\s+and\s+/i)
	 *
	 * @param str - String to split
	 * @param keyword - Keyword to split by (e.g., ' and ')
	 * @returns Array of parts
	 * @private
	 */
	private splitByKeyword(str: string, keyword: string): string[] {
		const result: string[] = [];
		const lowerStr = str.toLowerCase();
		const lowerKeyword = keyword.toLowerCase();
		let lastIndex = 0;

		let index = lowerStr.indexOf(lowerKeyword, lastIndex);
		while (index !== -1) {
			result.push(str.slice(lastIndex, index));
			lastIndex = index + keyword.length;
			index = lowerStr.indexOf(lowerKeyword, lastIndex);
		}

		result.push(str.slice(lastIndex));
		return result;
	}

	/**
	 * Get field value from document, supporting nested property access
	 *
	 * @param document - Document to extract field value from
	 * @param fieldName - Field name (supports dot notation for nested properties)
	 * @returns Field value or undefined if not found
	 * @private
	 */
	private getFieldValue(
		document: Record<string, unknown>,
		fieldName: string,
	): unknown {
		return fieldName.split('.').reduce<unknown>((obj, key) => {
			if (obj && typeof obj === 'object' && key in obj) {
				return (obj as Record<string, unknown>)[key];
			}
			return undefined;
		}, document);
	}

	/**
	 * Convert OData filter syntax to LiQE syntax
	 *
	 * Uses safe regex patterns that avoid catastrophic backtracking:
	 * - Negated character classes [^\s] instead of .*
	 * - Bounded quantifiers where possible
	 * - Simple alternations without nested quantifiers
	 *
	 * @param odataFilter - OData-style filter string
	 * @returns LiQE-compatible filter string
	 * @private
	 */
	private convertODataToLiQE(odataFilter: string): string {
		let liqeQuery = odataFilter;

		// Handle string functions first using safe regex patterns
		// contains(field, 'text') -> field:text
		// Pattern: contains followed by ( field , 'value' )
		// Uses [^)]+ to match non-paren chars (linear time)
		liqeQuery = liqeQuery.replace(
			/contains\(([^,]+),\s*'([^']+)'\)/gi,
			(_, field, value) => `${field.trim()}:${value}`,
		);
		liqeQuery = liqeQuery.replace(
			/contains\(([^,]+),\s*"([^"]+)"\)/gi,
			(_, field, value) => `${field.trim()}:${value}`,
		);

		// startswith(field, 'text') -> field:text*
		liqeQuery = liqeQuery.replace(
			/startswith\(([^,]+),\s*'([^']+)'\)/gi,
			(_, field, value) => `${field.trim()}:${value}*`,
		);
		liqeQuery = liqeQuery.replace(
			/startswith\(([^,]+),\s*"([^"]+)"\)/gi,
			(_, field, value) => `${field.trim()}:${value}*`,
		);

		// endswith(field, 'text') -> field:*text
		liqeQuery = liqeQuery.replace(
			/endswith\(([^,]+),\s*'([^']+)'\)/gi,
			(_, field, value) => `${field.trim()}:*${value}`,
		);
		liqeQuery = liqeQuery.replace(
			/endswith\(([^,]+),\s*"([^"]+)"\)/gi,
			(_, field, value) => `${field.trim()}:*${value}`,
		);

		// Handle comparison operators using safe patterns
		// Pattern: word + space + operator + space + value
		// Uses \w+ for field names (bounded) and specific patterns for values

		// field gt value -> field:>value (numeric)
		liqeQuery = liqeQuery.replace(/(\w+) gt (\d+)/g, '$1:>$2');

		// field lt value -> field:<value (numeric)
		liqeQuery = liqeQuery.replace(/(\w+) lt (\d+)/g, '$1:<$2');

		// field ge value -> field:>=value (numeric)
		liqeQuery = liqeQuery.replace(/(\w+) ge (\d+)/g, '$1:>=$2');

		// field le value -> field:<=value (numeric)
		liqeQuery = liqeQuery.replace(/(\w+) le (\d+)/g, '$1:<=$2');

		// field eq 'value' -> field:/^value$/ (exact string match)
		liqeQuery = liqeQuery.replace(
			/(\w+) eq '([^']+)'/g,
			'$1:/^$2$$/',
		);
		liqeQuery = liqeQuery.replace(
			/(\w+) eq "([^"]+)"/g,
			'$1:/^$2$$/',
		);

		// field ne 'value' -> NOT field:/^value$/ (not equal string)
		liqeQuery = liqeQuery.replace(
			/(\w+) ne '([^']+)'/g,
			'NOT $1:/^$2$$/',
		);
		liqeQuery = liqeQuery.replace(
			/(\w+) ne "([^"]+)"/g,
			'NOT $1:/^$2$$/',
		);

		// Handle boolean values (exact match)
		liqeQuery = liqeQuery.replace(/(\w+) eq true\b/g, '$1:/^true$$/');
		liqeQuery = liqeQuery.replace(/(\w+) eq false\b/g, '$1:/^false$$/');

		// Handle logical operators using string replacement (safer than regex)
		liqeQuery = this.replaceLogicalOperators(liqeQuery);

		// Handle parentheses - normalize spacing
		liqeQuery = this.normalizeParentheses(liqeQuery);

		// Normalize whitespace - replace multiple spaces with single space
		liqeQuery = this.normalizeWhitespace(liqeQuery);

		return liqeQuery;
	}

	/**
	 * Replace logical operators (and/or) with uppercase versions
	 * Uses string methods to avoid regex backtracking issues
	 *
	 * @param query - Query string to process
	 * @returns Query with normalized logical operators
	 * @private
	 */
	private replaceLogicalOperators(query: string): string {
		// Split by spaces and replace 'and'/'or' tokens
		return query
			.split(' ')
			.map((token) => {
				const lower = token.toLowerCase();
				if (lower === 'and') return 'AND';
				if (lower === 'or') return 'OR';
				return token;
			})
			.join(' ');
	}

	/**
	 * Normalize parentheses spacing without using complex regex
	 *
	 * @param query - Query string to process
	 * @returns Query with normalized parentheses
	 * @private
	 */
	private normalizeParentheses(query: string): string {
		let result = '';
		for (let i = 0; i < query.length; i++) {
			const char = query[i];
			if (char === '(') {
				// Add space before ( if needed, space after
				if (result.length > 0 && result[result.length - 1] !== ' ') {
					result += ' ';
				}
				result += '(';
			} else if (char === ')') {
				// Remove trailing space before ), add space after
				result = result.trimEnd();
				result += ') ';
			} else {
				result += char;
			}
		}
		return result.trim();
	}

	/**
	 * Normalize whitespace - replace multiple spaces with single space
	 * Uses string methods to avoid regex backtracking
	 *
	 * @param query - Query string to process
	 * @returns Query with normalized whitespace
	 * @private
	 */
	private normalizeWhitespace(query: string): string {
		return query
			.split(' ')
			.filter((part) => part.length > 0)
			.join(' ');
	}

	/**
	 * Validate if a filter string is supported by LiQE
	 *
	 * @param filterString - Filter string to validate
	 * @returns True if the filter can be parsed by LiQE, false otherwise
	 */
	isFilterSupported(filterString: string): boolean {
		if (!filterString || filterString.trim() === '') {
			return true;
		}

		// Safety check for input length
		if (filterString.length > MAX_FILTER_LENGTH) {
			return false;
		}

		// Check for valid operators using indexOf (no regex backtracking risk)
		const lowerFilter = filterString.toLowerCase();
		const hasOperator =
			lowerFilter.includes(' eq ') ||
			lowerFilter.includes(' ne ') ||
			lowerFilter.includes(' gt ') ||
			lowerFilter.includes(' lt ') ||
			lowerFilter.includes(' ge ') ||
			lowerFilter.includes(' le ') ||
			lowerFilter.includes(' and ') ||
			lowerFilter.includes(' or ') ||
			lowerFilter.includes('contains(') ||
			lowerFilter.includes('startswith(') ||
			lowerFilter.includes('endswith(');

		if (!hasOperator) {
			return false;
		}

		try {
			const liqeQuery = this.convertODataToLiQE(filterString);
			const parsed = parse(liqeQuery);

			// Additional validation: ensure the parsed query has a valid structure
			if (!parsed || typeof parsed !== 'object') {
				return false;
			}

			// Check if it's a valid LiQE query structure
			if ('type' in (parsed as Record<string, unknown>)) {
				const t = (parsed as Record<string, unknown>)['type'];
				return (
					t === 'Tag' || t === 'LogicalExpression' || t === 'UnaryOperator'
				);
			}
			return false;
		} catch {
			return false;
		}
	}

	/**
	 * Get information about supported filter syntax and operators
	 *
	 * @returns Object containing supported operators and functions
	 */
	getSupportedFeatures(): {
		operators: string[];
		functions: string[];
		examples: string[];
	} {
		return {
			operators: [
				'eq', // equals
				'ne', // not equals
				'gt', // greater than
				'lt', // less than
				'ge', // greater than or equal
				'le', // less than or equal
				'and', // logical and
				'or', // logical or
			],
			functions: [
				'contains', // substring matching
				'startswith', // prefix matching
				'endswith', // suffix matching
			],
			examples: [
				"title eq 'Mountain Bike'",
				'price gt 100 and price lt 500',
				"contains(description, 'bike')",
				"startswith(title, 'Mountain')",
				"category eq 'Sports' or category eq 'Tools'",
				'(price ge 100 and price le 500) and isActive eq true',
			],
		};
	}
}
