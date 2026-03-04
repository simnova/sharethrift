import { Question, type AnswersQuestions, type UsesAbilities } from '@serenity-js/core';

/**
 * FormValidationError - Question that checks if a validation error is displayed in the DOM
 *
 * This question works with DOM tests that render components using RenderComponents ability.
 * It queries the rendered DOM for validation error messages using accessible selectors.
 *
 * For domain/session level tests, returns empty string (no DOM rendered).
 */
export class FormValidationError extends Question<Promise<string>> {
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
		const message = fieldName ? `form validation error for ${fieldName}` : 'form validation error';
		super(message);
	}

	override answeredBy(_actor: AnswersQuestions & UsesAbilities): Promise<string> {
		// Query the DOM for validation errors using accessible selectors
		// This works with tests that render components in happy-dom or real browsers

		try {
			// Try to get the error from document if it exists (for DOM tests)
			if (typeof document === 'undefined') {
				// No DOM available - expected for domain/session tests
				return Promise.resolve('');
			}

			if (this.type === 'form') {
				// Get general form error message
				const errorElement = document.querySelector('[role="alert"]') ||
					document.querySelector('.ant-message-error') ||
					document.querySelector('[data-testid="form-error"]');
				return Promise.resolve(errorElement?.textContent?.trim() || '');
			}

			if (this.type === 'field' && this.fieldName) {
				// Get field-specific error message using aria-label or data attribute
				const fieldLabel = this.normalizeFieldName(this.fieldName);
				const errorElement = document.querySelector(`[data-error="${fieldLabel}"]`) ||
					document.querySelector(`[aria-label*="error"][aria-label*="${this.fieldName}"]`);
				return Promise.resolve(errorElement?.textContent?.trim() || '');
			}

			return Promise.resolve('');
		} catch {
			// No DOM available
			return Promise.resolve('');
		}
	}

	/**
	 * Normalize field name for selector
	 * "title" stays "title", "Daily Rate" becomes "daily-rate"
	 */
	private normalizeFieldName(name: string): string {
		return name.toLowerCase().replace(/\s+/g, '-');
	}

	override toString = () => `form validation error${this.fieldName ? ` for ${this.fieldName}` : ''}`;
}
