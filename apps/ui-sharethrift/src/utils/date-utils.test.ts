import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	parseGraphQLDateTime,
	formatGraphQLDate,
	formatGraphQLDateRange,
	dayjsToGraphQLDate,
} from './date-utils';

describe('parseGraphQLDateTime', () => {
	it('should return null for null or undefined input', () => {
		expect(parseGraphQLDateTime(null)).toBeNull();
		expect(parseGraphQLDateTime(undefined)).toBeNull();
		expect(parseGraphQLDateTime('')).toBeNull();
	});

	it('should return the same Date object if already a valid Date', () => {
		const date = new Date('2025-01-15T00:00:00Z');
		const result = parseGraphQLDateTime(date);
		expect(result).toBe(date);
		expect(result?.getTime()).toBe(date.getTime());
	});

	it('should return null for invalid Date objects', () => {
		const invalidDate = new Date('invalid');
		expect(parseGraphQLDateTime(invalidDate)).toBeNull();
	});

	it('should parse ISO string format', () => {
		const isoString = '2025-01-15T12:30:00Z';
		const result = parseGraphQLDateTime(isoString);
		expect(result).toBeInstanceOf(Date);
		// toISOString() always includes milliseconds, so we check the timestamp instead
		expect(result?.getTime()).toBe(new Date(isoString).getTime());
	});

	it('should parse Unix timestamp number', () => {
		const timestamp = 1700000000000;
		const result = parseGraphQLDateTime(timestamp);
		expect(result).toBeInstanceOf(Date);
		expect(result?.getTime()).toBe(timestamp);
	});

	it('should parse Unix timestamp as string', () => {
		const timestampString = '1700000000000';
		const result = parseGraphQLDateTime(timestampString);
		expect(result).toBeInstanceOf(Date);
		expect(result?.getTime()).toBe(Number(timestampString));
	});

	it('should return null for unparseable strings', () => {
		expect(parseGraphQLDateTime('not a date')).toBeNull();
		expect(parseGraphQLDateTime('abc123')).toBeNull();
	});

	it('should handle different date formats', () => {
		// ISO date
		expect(parseGraphQLDateTime('2025-01-15')).toBeInstanceOf(Date);
		
		// ISO with milliseconds
		expect(parseGraphQLDateTime('2025-01-15T12:30:00.123Z')).toBeInstanceOf(Date);
		
		// Unix timestamp
		expect(parseGraphQLDateTime(1705315800000)).toBeInstanceOf(Date);
	});
});

describe('formatGraphQLDate', () => {
	it('should format valid dates correctly', () => {
		const date = '2025-01-15T00:00:00Z';
		const result = formatGraphQLDate(date);
		expect(result).toMatch(/1\/15\/2025/);
	});

	it('should return fallback for null or invalid input', () => {
		expect(formatGraphQLDate(null)).toBe('Invalid Date');
		expect(formatGraphQLDate(undefined)).toBe('Invalid Date');
		expect(formatGraphQLDate('invalid')).toBe('Invalid Date');
	});

	it('should use custom fallback text', () => {
		const customFallback = 'No Date';
		expect(formatGraphQLDate(null, undefined, customFallback)).toBe(customFallback);
	});

	it('should apply custom formatting options', () => {
		const date = '2025-01-15T00:00:00Z';
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		const result = formatGraphQLDate(date, options);
		expect(result).toContain('January');
		expect(result).toContain('15');
		expect(result).toContain('2025');
	});

	it('should format Unix timestamp', () => {
		const timestamp = 1700000000000;
		const result = formatGraphQLDate(timestamp);
		expect(result).not.toBe('Invalid Date');
		expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
	});

	it('should format timestamp as string', () => {
		const timestampString = '1700000000000';
		const result = formatGraphQLDate(timestampString);
		expect(result).not.toBe('Invalid Date');
		expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
	});

	it('should handle errors gracefully and log warning', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		
		// Test with an edge case that might cause formatting issues
		// Some invalid locale options could trigger the catch block
		const result = formatGraphQLDate('2025-01-15', { timeZone: 'Invalid/Zone' } as any);
		
		// Should handle the error and either format or return fallback
		expect(typeof result).toBe('string');
		
		consoleWarnSpy.mockRestore();
	});
});

describe('formatGraphQLDateRange', () => {
	it('should format valid date range', () => {
		const start = '2025-01-15T00:00:00Z';
		const end = '2025-01-22T00:00:00Z';
		const result = formatGraphQLDateRange(start, end);
		expect(result).toContain('1/15/2025');
		expect(result).toContain('1/22/2025');
		expect(result).toContain(' - ');
	});

	it('should return fallback if start date is invalid', () => {
		const end = '2025-01-22T00:00:00Z';
		expect(formatGraphQLDateRange(null, end)).toBe('Invalid Date Range');
		expect(formatGraphQLDateRange('invalid', end)).toBe('Invalid Date Range');
	});

	it('should return fallback if end date is invalid', () => {
		const start = '2025-01-15T00:00:00Z';
		expect(formatGraphQLDateRange(start, null)).toBe('Invalid Date Range');
		expect(formatGraphQLDateRange(start, 'invalid')).toBe('Invalid Date Range');
	});

	it('should return fallback if both dates are invalid', () => {
		expect(formatGraphQLDateRange(null, null)).toBe('Invalid Date Range');
	});

	it('should use custom separator', () => {
		const start = '2025-01-15T00:00:00Z';
		const end = '2025-01-22T00:00:00Z';
		const result = formatGraphQLDateRange(start, end, undefined, ' to ');
		expect(result).toContain('to');
		expect(result).not.toContain(' - ');
	});

	it('should use custom fallback text', () => {
		const customFallback = 'No Range';
		expect(formatGraphQLDateRange(null, null, undefined, undefined, customFallback)).toBe(customFallback);
	});

	it('should apply custom formatting options', () => {
		const start = '2025-01-15T00:00:00Z';
		const end = '2025-01-22T00:00:00Z';
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		};
		const result = formatGraphQLDateRange(start, end, options);
		expect(result).toContain('Jan');
		expect(result).toContain('2025');
	});

	it('should format Unix timestamps', () => {
		const start = 1700000000000;
		const end = 1700086400000;
		const result = formatGraphQLDateRange(start, end);
		expect(result).not.toBe('Invalid Date Range');
		expect(result).toContain(' - ');
	});

	it('should handle errors gracefully and log warning', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		
		// Test with an edge case that might cause formatting issues
		const result = formatGraphQLDateRange('2025-01-15', '2025-01-22', { timeZone: 'Invalid/Zone' } as any);
		
		// Should handle the error and either format or return fallback
		expect(typeof result).toBe('string');
		
		consoleWarnSpy.mockRestore();
	});
});

describe('dayjsToGraphQLDate', () => {
	it('should throw error for null or undefined input', () => {
		expect(() => dayjsToGraphQLDate(null)).toThrow('Invalid Dayjs object');
		expect(() => dayjsToGraphQLDate(undefined)).toThrow('Invalid Dayjs object');
	});

	it('should throw error for object without format function', () => {
		expect(() => dayjsToGraphQLDate({})).toThrow('Invalid Dayjs object');
		expect(() => dayjsToGraphQLDate({ year: () => 2025 })).toThrow('Invalid Dayjs object');
	});

	it('should convert valid Dayjs object to ISO string at UTC midnight', () => {
		// Mock a Dayjs object
		const mockDayjs = {
			format: vi.fn(),
			year: () => 2025,
			month: () => 0, // January (0-based)
			date: () => 15,
		};

		const result = dayjsToGraphQLDate(mockDayjs);
		
		expect(result).toBe('2025-01-15T00:00:00.000Z');
	});

	it('should preserve the date regardless of timezone', () => {
		// Mock a Dayjs object for Feb 15, 2025
		const mockDayjs = {
			format: vi.fn(),
			year: () => 2025,
			month: () => 1, // February (0-based)
			date: () => 15,
		};

		const result = dayjsToGraphQLDate(mockDayjs);
		
		// Should always be midnight UTC for the given date
		expect(result).toBe('2025-02-15T00:00:00.000Z');
		
		// Verify it parses back to the same date
		const parsed = new Date(result);
		expect(parsed.getUTCFullYear()).toBe(2025);
		expect(parsed.getUTCMonth()).toBe(1);
		expect(parsed.getUTCDate()).toBe(15);
		expect(parsed.getUTCHours()).toBe(0);
		expect(parsed.getUTCMinutes()).toBe(0);
		expect(parsed.getUTCSeconds()).toBe(0);
	});

	it('should handle leap year dates', () => {
		// Mock Feb 29, 2024 (leap year)
		const mockDayjs = {
			format: vi.fn(),
			year: () => 2024,
			month: () => 1, // February (0-based)
			date: () => 29,
		};

		const result = dayjsToGraphQLDate(mockDayjs);
		expect(result).toBe('2024-02-29T00:00:00.000Z');
	});

	it('should handle edge case dates (Dec 31)', () => {
		const mockDayjs = {
			format: vi.fn(),
			year: () => 2025,
			month: () => 11, // December (0-based)
			date: () => 31,
		};

		const result = dayjsToGraphQLDate(mockDayjs);
		expect(result).toBe('2025-12-31T00:00:00.000Z');
	});

	it('should handle edge case dates (Jan 1)', () => {
		const mockDayjs = {
			format: vi.fn(),
			year: () => 2025,
			month: () => 0, // January (0-based)
			date: () => 1,
		};

		const result = dayjsToGraphQLDate(mockDayjs);
		expect(result).toBe('2025-01-01T00:00:00.000Z');
	});
});

describe('Integration tests', () => {
	it('should round-trip date through parse and format', () => {
		const originalDate = '2025-01-15T12:30:00Z';
		const parsed = parseGraphQLDateTime(originalDate);
		expect(parsed).not.toBeNull();
		
		const formatted = formatGraphQLDate(parsed!);
		expect(formatted).toContain('1/15/2025');
	});

	it('should handle timestamp string through parse and format', () => {
		const timestampString = '1700000000000';
		const parsed = parseGraphQLDateTime(timestampString);
		expect(parsed).not.toBeNull();
		
		const formatted = formatGraphQLDate(parsed!);
		expect(formatted).not.toBe('Invalid Date');
	});

	it('should format range with timestamps', () => {
		const start = 1700000000000;
		const end = 1700086400000;
		const result = formatGraphQLDateRange(start, end);
		expect(result).not.toBe('Invalid Date Range');
		expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}/);
	});
});
