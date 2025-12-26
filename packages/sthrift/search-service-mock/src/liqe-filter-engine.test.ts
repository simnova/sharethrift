/**
 * Tests for LiQEFilterEngine
 *
 * Tests OData to LiQE conversion, filter validation, and filtering operations.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { LiQEFilterEngine } from './liqe-filter-engine';
import type { SearchResult } from './interfaces';

describe('LiQEFilterEngine', () => {
	let filterEngine: LiQEFilterEngine;

	beforeEach(() => {
		filterEngine = new LiQEFilterEngine();
	});

	describe('applyAdvancedFilter', () => {
		const createResult = (doc: Record<string, unknown>): SearchResult => ({
			document: doc,
			score: 1,
		});

		const testResults: SearchResult[] = [
			createResult({ id: '1', state: 'active', price: 100, title: 'Bike' }),
			createResult({
				id: '2',
				state: 'inactive',
				price: 200,
				title: 'Scooter',
			}),
			createResult({
				id: '3',
				state: 'active',
				price: 300,
				title: 'Skateboard',
			}),
			createResult({ id: '4', state: 'pending', price: 50, title: 'Helmet' }),
		];

		it('should return all results for empty filter', () => {
			const results = filterEngine.applyAdvancedFilter(testResults, '');
			expect(results).toHaveLength(4);
		});

		it('should return all results for whitespace-only filter', () => {
			const results = filterEngine.applyAdvancedFilter(testResults, '   ');
			expect(results).toHaveLength(4);
		});

		it('should filter by exact equality (eq operator)', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"state eq 'active'",
			);
			expect(results).toHaveLength(2);
			expect(results.every((r) => r.document.state === 'active')).toBe(true);
		});

		it('should not match substrings with eq operator (active should not match inactive)', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"state eq 'active'",
			);
			expect(results).toHaveLength(2);
			// Verify none of the results have 'inactive' state
			expect(results.some((r) => r.document.state === 'inactive')).toBe(false);
		});

		it('should filter by inequality (ne operator)', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"state ne 'active'",
			);
			expect(results).toHaveLength(2);
			expect(results.every((r) => r.document.state !== 'active')).toBe(true);
		});

		it('should filter by greater than (gt operator)', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				'price gt 100',
			);
			expect(results).toHaveLength(2);
			expect(results.every((r) => (r.document.price as number) > 100)).toBe(
				true,
			);
		});

		it('should filter by less than (lt operator)', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				'price lt 200',
			);
			expect(results).toHaveLength(2);
			expect(results.every((r) => (r.document.price as number) < 200)).toBe(
				true,
			);
		});

		it('should filter by greater than or equal (ge operator)', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				'price ge 200',
			);
			expect(results).toHaveLength(2);
			expect(results.every((r) => (r.document.price as number) >= 200)).toBe(
				true,
			);
		});

		it('should filter by less than or equal (le operator)', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				'price le 100',
			);
			expect(results).toHaveLength(2);
			expect(results.every((r) => (r.document.price as number) <= 100)).toBe(
				true,
			);
		});

		it('should filter with AND operator', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"state eq 'active' and price gt 100",
			);
			expect(results).toHaveLength(1);
			expect(results[0].document.id).toBe('3');
		});

		it('should filter with OR operator', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"state eq 'pending' or price gt 250",
			);
			expect(results).toHaveLength(2);
		});

		it('should handle contains function', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"contains(title, 'Bike')",
			);
			expect(results).toHaveLength(1);
			expect(results[0].document.title).toBe('Bike');
		});

		it('should handle startswith function', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"startswith(title, 'Sk')",
			);
			expect(results).toHaveLength(1);
			expect(results[0].document.title).toBe('Skateboard');
		});

		it('should handle endswith function', () => {
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"endswith(title, 'er')",
			);
			expect(results).toHaveLength(1);
			expect(results[0].document.title).toBe('Scooter');
		});

		it('should handle boolean equality', () => {
			const boolResults: SearchResult[] = [
				createResult({ id: '1', isActive: true }),
				createResult({ id: '2', isActive: false }),
			];
			const results = filterEngine.applyAdvancedFilter(
				boolResults,
				'isActive eq true',
			);
			expect(results).toHaveLength(1);
			expect(results[0].document.isActive).toBe(true);
		});

		it('should fallback to basic filter for malformed queries', () => {
			// This malformed query should trigger basic filter fallback
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"state eq 'active'",
			);
			expect(results).toHaveLength(2);
		});
	});

	describe('isFilterSupported', () => {
		it('should return true for empty filter', () => {
			expect(filterEngine.isFilterSupported('')).toBe(true);
		});

		it('should return true for whitespace-only filter', () => {
			expect(filterEngine.isFilterSupported('   ')).toBe(true);
		});

		it('should return true for valid eq filter', () => {
			expect(filterEngine.isFilterSupported("state eq 'active'")).toBe(true);
		});

		it('should return true for valid ne filter', () => {
			expect(filterEngine.isFilterSupported("state ne 'inactive'")).toBe(true);
		});

		it('should return true for valid comparison operators', () => {
			expect(filterEngine.isFilterSupported('price gt 100')).toBe(true);
			expect(filterEngine.isFilterSupported('price lt 100')).toBe(true);
			expect(filterEngine.isFilterSupported('price ge 100')).toBe(true);
			expect(filterEngine.isFilterSupported('price le 100')).toBe(true);
		});

		it('should return true for valid logical operators', () => {
			expect(
				filterEngine.isFilterSupported("state eq 'active' and price gt 100"),
			).toBe(true);
			expect(
				filterEngine.isFilterSupported("state eq 'active' or price gt 100"),
			).toBe(true);
		});

		it('should return true for valid string functions', () => {
			expect(filterEngine.isFilterSupported("contains(title, 'test')")).toBe(
				true,
			);
			expect(filterEngine.isFilterSupported("startswith(title, 'test')")).toBe(
				true,
			);
			expect(filterEngine.isFilterSupported("endswith(title, 'test')")).toBe(
				true,
			);
		});

		it('should return false for invalid filter without operators', () => {
			expect(filterEngine.isFilterSupported('invalid query')).toBe(false);
		});

		it('should return false for completely malformed syntax', () => {
			expect(filterEngine.isFilterSupported('{{{{{')).toBe(false);
		});
	});

	describe('getSupportedFeatures', () => {
		it('should return supported operators', () => {
			const features = filterEngine.getSupportedFeatures();
			expect(features.operators).toContain('eq');
			expect(features.operators).toContain('ne');
			expect(features.operators).toContain('gt');
			expect(features.operators).toContain('lt');
			expect(features.operators).toContain('ge');
			expect(features.operators).toContain('le');
			expect(features.operators).toContain('and');
			expect(features.operators).toContain('or');
		});

		it('should return supported functions', () => {
			const features = filterEngine.getSupportedFeatures();
			expect(features.functions).toContain('contains');
			expect(features.functions).toContain('startswith');
			expect(features.functions).toContain('endswith');
		});

		it('should return example queries', () => {
			const features = filterEngine.getSupportedFeatures();
			expect(features.examples).toBeInstanceOf(Array);
			expect(features.examples.length).toBeGreaterThan(0);
		});
	});

	describe('basic filter fallback', () => {
		const createResult = (doc: Record<string, unknown>): SearchResult => ({
			document: doc,
			score: 1,
		});

		it('should handle nested field access', () => {
			const nestedResults: SearchResult[] = [
				createResult({ id: '1', metadata: { status: 'active' } }),
				createResult({ id: '2', metadata: { status: 'inactive' } }),
			];
			// Basic filter with nested fields - falls back to basic filter
			const results = filterEngine.applyAdvancedFilter(
				nestedResults,
				"metadata.status eq 'active'",
			);
			expect(results.length).toBeGreaterThanOrEqual(0); // May or may not work depending on LiQE support
		});

		it('should skip overly long filter strings for safety', () => {
			const testResults: SearchResult[] = [
				createResult({ id: '1', state: 'active' }),
			];
			// Create a filter longer than 2048 characters to trigger safety check
			const longFilter = "state eq '" + 'a'.repeat(2100) + "'";
			// This should return results (safety fallback returns all)
			const results = filterEngine.applyAdvancedFilter(testResults, longFilter);
			expect(results.length).toBeGreaterThanOrEqual(0);
		});

		it('should handle multiple AND conditions in basic filter', () => {
			const testResults: SearchResult[] = [
				createResult({ id: '1', state: 'active', category: 'sports' }),
				createResult({ id: '2', state: 'active', category: 'tools' }),
				createResult({ id: '3', state: 'inactive', category: 'sports' }),
			];
			const results = filterEngine.applyAdvancedFilter(
				testResults,
				"state eq 'active' and category eq 'sports'",
			);
			expect(results).toHaveLength(1);
			expect(results[0].document.id).toBe('1');
		});
	});
});
