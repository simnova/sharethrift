/**
 * Utility functions for safely handling GraphQL DateTime scalar values
 * 
 * The DateTime scalar from graphql-scalars can return values as:
 * - ISO string format (e.g., "2025-02-15T00:00:00Z")
 * - Unix timestamp number (e.g., 1739577600000)
 * 
 * This module provides safe parsing to prevent "Invalid Date" issues.
 */

/**
 * Safely parses a GraphQL DateTime scalar value to a Date object
 * 
 * @param dateValue - The DateTime value from GraphQL (string | number | null | undefined)
 * @returns Valid Date object or null if parsing fails
 */
export function parseGraphQLDateTime(dateValue: any): Date | null {
	if (!dateValue) {
		return null;
	}

	// If it's already a Date object, return it
	if (dateValue instanceof Date) {
		return isNaN(dateValue.getTime()) ? null : dateValue;
	}

	// Try parsing as is (works for ISO strings and valid numbers)
	const parsed = new Date(dateValue);
	if (!isNaN(parsed.getTime())) {
		return parsed;
	}

	// If direct parsing failed, try parsing as number (for string timestamps)
	if (typeof dateValue === 'string') {
		const numValue = Number(dateValue);
		if (!isNaN(numValue)) {
			const numParsed = new Date(numValue);
			if (!isNaN(numParsed.getTime())) {
				return numParsed;
			}
		}
	}

	return null;
}

/**
 * Safely formats a GraphQL DateTime scalar value to a localized date string
 * 
 * @param dateValue - The DateTime value from GraphQL
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string or fallback text
 */
export function formatGraphQLDate(
	dateValue: any,
	options?: Intl.DateTimeFormatOptions,
	fallback = 'Invalid Date'
): string {
	const date = parseGraphQLDateTime(dateValue);
	if (!date) {
		return fallback;
	}

	try {
		return date.toLocaleDateString('en-US', options);
	} catch (error) {
		console.warn('Error formatting date:', error);
		return fallback;
	}
}

/**
 * Safely formats a date range from GraphQL DateTime scalar values
 * 
 * @param startDate - The start DateTime value from GraphQL
 * @param endDate - The end DateTime value from GraphQL
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date range string
 */
export function formatGraphQLDateRange(
	startDate: any,
	endDate: any,
	options?: Intl.DateTimeFormatOptions,
	separator = ' - ',
	fallback = 'Invalid Date Range'
): string {
	const start = parseGraphQLDateTime(startDate);
	const end = parseGraphQLDateTime(endDate);

	if (!start || !end) {
		return fallback;
	}

	try {
		const startStr = start.toLocaleDateString('en-US', options);
		const endStr = end.toLocaleDateString('en-US', options);
		return `${startStr}${separator}${endStr}`;
	} catch (error) {
		console.warn('Error formatting date range:', error);
		return fallback;
	}
}

/**
 * Converts a Dayjs object to a date string that preserves the intended date
 * regardless of timezone when sent to GraphQL DateTime scalar
 * 
 * @param dayjsDate - Dayjs object from date picker
 * @returns ISO string at start of day in UTC to preserve the date
 */
export function dayjsToGraphQLDate(dayjsDate: any): string {
	if (!dayjsDate || typeof dayjsDate.format !== 'function') {
		throw new Error('Invalid Dayjs object');
	}
	
	// Get the date components in local time
	const year = dayjsDate.year();
	const month = dayjsDate.month(); // 0-based
	const day = dayjsDate.date();
	
	// Create a new Date object at start of day in UTC to preserve the intended date
	const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
	
	return utcDate.toISOString();
}