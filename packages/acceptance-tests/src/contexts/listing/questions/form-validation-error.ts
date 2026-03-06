import { Question, type AnswersQuestions, type UsesAbilities } from '@serenity-js/core';

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

	override answeredBy(_actor: AnswersQuestions & UsesAbilities): Promise<string> {
		try {
			if (typeof document === 'undefined') {
				return Promise.resolve('');
			}

			if (this.type === 'form') {
				const errorElement = document.querySelector('[role="alert"]') ||
					document.querySelector('.ant-message-error') ||
					document.querySelector('[data-testid="form-error"]');
				return Promise.resolve(errorElement?.textContent?.trim() || '');
			}

			if (this.type === 'field' && this.fieldName) {
				const fieldLabel = this.normalizeFieldName(this.fieldName);
				const errorElement = document.querySelector(`[data-error="${fieldLabel}"]`) ||
					document.querySelector(`[aria-label*="error"][aria-label*="${this.fieldName}"]`);
				return Promise.resolve(errorElement?.textContent?.trim() || '');
			}

			return Promise.resolve('');
		} catch {
			return Promise.resolve('');
		}
	}

	private normalizeFieldName(name: string): string {
		return name.toLowerCase().replace(/\s+/g, '-');
	}

	override toString = () => {
		const suffix = this.fieldName ? ` for ${this.fieldName}` : '';
		return `form validation error${suffix}`;
	};
}
