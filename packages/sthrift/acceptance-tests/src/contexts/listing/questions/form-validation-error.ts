import { Question, type AnswersQuestions, type UsesAbilities } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../shared/abilities/browse-the-web.ts';

export class FormValidationError extends Question<Promise<string>> {
	static displayed(): FormValidationError {
		return new FormValidationError('form');
	}
    
	static forField(fieldName: string): FormValidationError {
		return new FormValidationError('field', fieldName);
	}

	constructor(private readonly type: 'form' | 'field' = 'form', private readonly fieldName?: string) {
		const message = fieldName ? `form validation error for ${fieldName}` : 'form validation error';
		super(message);
	}

	override async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		// Try to use Playwright page (E2E level)
		try {
			const { page } = BrowseTheWeb.as(actor as UsesAbilities);

			if (this.type === 'field' && this.fieldName) {
				const errorEl = page.locator('.ant-form-item-explain-error').first();
				const text = await errorEl.textContent({ timeout: 3_000 }).catch(() => null);
				return text?.trim() || '';
			}

			// Form-level: look for any validation error or alert
			const errorEl = page.locator('.ant-form-item-explain-error, [role="alert"], .ant-message-error').first();
			const text = await errorEl.textContent({ timeout: 3_000 }).catch(() => null);
			return text?.trim() || '';
		} catch {
			// BrowseTheWeb ability not available (domain/session level) — return empty
			return '';
		}
	}

	override toString = () => {
		const suffix = this.fieldName ? ` for ${this.fieldName}` : '';
		return `form validation error${suffix}`;
	};
}
