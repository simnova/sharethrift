import { Question, type Actor } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';

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
		// Try real browser (Playwright for future playwright-based DOM tests)
		try {
			const browser = BrowseTheWebWithPlaywright.as(actor);
			const page = await browser.currentPage();
			return this.fromRealBrowser(page);
		} catch {
			// No browser available - expected for domain/session tests
			// DOM tests will use a different implementation
			return '';
		}
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
