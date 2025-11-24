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
 */

import { parse, test } from 'liqe';
import type { SearchResult } from './interfaces.js';

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
		if (filterString.length > 2048) {
			console.warn('Filter string too long; skipping basic filter for safety.');
			return results;
		}

		// Linear-time parse for basic patterns like: "field eq 'value'" joined by "and"
		const filters: Array<{ field: string; value: string }> = [];
		const parts = filterString.trim().split(/\s+and\s+/i);
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
	 * @param odataFilter - OData-style filter string
	 * @returns LiQE-compatible filter string
	 * @private
	 */
	private convertODataToLiQE(odataFilter: string): string {
		let liqeQuery = odataFilter;

		// Handle string functions first
		// Note: LiQE doesn't support *text* pattern, so we use a workaround
		// contains(field, 'text') -> field:text (LiQE will match substrings)
		liqeQuery = liqeQuery.replace(
			/contains\s*\(\s*(\w+)\s*,\s*['"]([^'"]+)['"]\s*\)/gi,
			'$1:$2',
		);

		// startswith(field, 'text') -> field:text*
		liqeQuery = liqeQuery.replace(
			/startswith\s*\(\s*(\w+)\s*,\s*['"]([^'"]+)['"]\s*\)/gi,
			'$1:$2*',
		);

		// endswith(field, 'text') -> field:*text
		liqeQuery = liqeQuery.replace(
			/endswith\s*\(\s*(\w+)\s*,\s*['"]([^'"]+)['"]\s*\)/gi,
			'$1:*$2',
		);

		// Handle comparison operators (order matters - do numeric comparisons first)
		// field gt value -> field:>value
		liqeQuery = liqeQuery.replace(/(\w+)\s+gt\s+(\d+)/g, '$1:>$2');

		// field lt value -> field:<value
		liqeQuery = liqeQuery.replace(/(\w+)\s+lt\s+(\d+)/g, '$1:<$2');

		// field ge value -> field:>=value
		liqeQuery = liqeQuery.replace(/(\w+)\s+ge\s+(\d+)/g, '$1:>=$2');

		// field le value -> field:<=value
		liqeQuery = liqeQuery.replace(/(\w+)\s+le\s+(\d+)/g, '$1:<=$2');

		// field eq 'value' -> field:value
		liqeQuery = liqeQuery.replace(/(\w+)\s+eq\s+['"]?([^'"]+)['"]?/g, '$1:$2');

		// field ne 'value' -> NOT field:value
		liqeQuery = liqeQuery.replace(
			/(\w+)\s+ne\s+['"]?([^'"]+)['"]?/g,
			'NOT $1:$2',
		);

		// Handle boolean values
		liqeQuery = liqeQuery.replace(/(\w+)\s+eq\s+true/g, '$1:true');
		liqeQuery = liqeQuery.replace(/(\w+)\s+eq\s+false/g, '$1:false');

		// Handle logical operators (case insensitive)
		liqeQuery = liqeQuery.replace(/\sand\s/gi, ' AND ');
		liqeQuery = liqeQuery.replace(/\sor\s/gi, ' OR ');

		// Handle parentheses spacing
		liqeQuery = liqeQuery.replace(/\s*\(\s*/g, ' (');
		liqeQuery = liqeQuery.replace(/\s*\)\s*/g, ') ');

		// Clean up extra spaces
		liqeQuery = liqeQuery.replace(/\s+/g, ' ').trim();

		return liqeQuery;
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

		// Basic OData syntax validation - must contain at least one operator with proper spacing
		const hasValidOperator =
			/\b(eq|ne|gt|lt|ge|le|and|or)\b|(contains|startswith|endswith)\s*\(/i.test(
				filterString,
			);
		if (!hasValidOperator) {
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
				return t === 'Tag' || t === 'LogicalExpression';
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

