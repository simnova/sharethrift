import { Question, type Actor } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { MockBrowser } from '../abilities/MockBrowser.js';

/**
 * FormValidationError - Question that checks if a validation error is displayed in the DOM
 *
 * Works with both real browser (Playwright) and mock browser for testing.
 */
export class FormValidationError extends Question<string> {
	/**
	 * Get the general form error message
	 */
	static displayed(): FormValidationError {
		return new FormValidationError('form');
	}

	/**
	 * Get error message for a specific field
	 * Example: FormValidationError.forField('title')
	 */
	static forField(fieldName: string): FormValidationError {
		return new FormValidationError('field', fieldName);
	}

	constructor(private readonly type: 'form' | 'field' = 'form', private readonly fieldName?: string) {
		super(`form validation error${fieldName ? ` for ${fieldName}` : ''}`);
	}

	async answeredBy(actor: Actor): Promise<string> {
		console.log(`[FormValidationError.answeredBy] Starting to retrieve error, type=${this.type}, fieldName=${this.fieldName}`);
		try {
			// Try to get the CURRENT mock browser first (not from actor, since actor might have stale reference)
			let mockBrowser = MockBrowser.current();
			
			if (mockBrowser) {
				console.log(`[FormValidationError.answeredBy] Using current MockBrowser (ID: ${mockBrowser.id})`);
				const page = mockBrowser.currentPage();
				return this.fromMockBrowser(page);
			}

			// Fall back to getting from actor abilities
			try {
				console.log(`[FormValidationError.answeredBy] Attempting to get MockBrowser ability from actor...`);
				mockBrowser = MockBrowser.as(actor);
				console.log(`[FormValidationError.answeredBy] Got MockBrowser from actor:`, mockBrowser);
				const page = mockBrowser.currentPage();
				return this.fromMockBrowser(page);
			} catch (err) {
				// Mock browser not available, try real browser
				console.log(`[FormValidationError.answeredBy] MockBrowser not available:`, err);
			}

			// Try real browser
			const browser = BrowseTheWebWithPlaywright.as(actor);
			const page = await browser.currentPage();
			return this.fromRealBrowser(page);
		} catch (error) {
			throw new Error(`Failed to retrieve validation error from DOM: ${error}`);
		}
	}

	private fromMockBrowser(page: any): string {
		if (this.type === 'form') {
			const errors = page.getErrors?.();
			// Return first error as form error (in JavaScript, object iteration order is insertion order)
			const firstError = Object.values(errors || {})[0];
			console.log(`[FormValidationError] Getting form error. All errors:`, errors, 'First:', firstError);
			return (firstError as string) || '';
		}

		if (this.type === 'field' && this.fieldName) {
			const errors = page.getErrors?.();
			const normalizedField = this.normalizeFieldName(this.fieldName);
			const error = (errors?.[normalizedField] as string) || '';
			console.log(`[FormValidationError] Getting field error for "${this.fieldName}" (normalized: "${normalizedField}"). All errors:`, errors, 'Result:', error);
			return error;
		}

		return '';
	}

	private async fromRealBrowser(page: any): Promise<string> {
		if (this.type === 'form') {
			// Get general form error message
			const errorElement = await page.$('[data-testid="form-error-message"]');
			if (!errorElement) {
				return ''; // No error displayed
			}
			const errorText = await errorElement.textContent();
			return errorText?.trim() || '';
		}

		if (this.type === 'field' && this.fieldName) {
			// Get field-specific error message
			const fieldErrorSelector = `[data-testid="error-${this.normalizeFieldName(this.fieldName)}"]`;
			const errorElement = await page.$(fieldErrorSelector);

			if (!errorElement) {
				return ''; // No error for this field
			}

			const errorText = await errorElement.textContent();
			return errorText?.trim() || '';
		}

		return '';
	}

	/**
	 * Normalize field name for selector
	 * "title" stays "title", "Daily Rate" becomes "daily-rate"
	 */
	private normalizeFieldName(name: string): string {
		return name.toLowerCase().replace(/\s+/g, '-');
	}

	toString = () => `form validation error${this.fieldName ? ` for ${this.fieldName}` : ''}`;
}
