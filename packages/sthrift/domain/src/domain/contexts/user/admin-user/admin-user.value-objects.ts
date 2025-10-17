import { DomainSeedwork } from '@cellix/domain-seedwork';
import { VOOptional } from '@lucaspaganini/value-objects';
import { Email as EmailBase } from '../../value-objects.ts';

/**
 * Value objects for AdminUser aggregate validation and data integrity.
 */

/**
 * Email value object with validation
 */
export class Email extends VOOptional(EmailBase, [undefined]) {}

/**
 * Username value object with validation
 */
export class Username extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('Username cannot be empty');
		}
		if (value.length < 3) {
			throw new Error('Username must be at least 3 characters');
		}
		if (value.length > 50) {
			throw new Error('Username cannot exceed 50 characters');
		}
		// Allow alphanumeric, underscore, hyphen, dot
		const usernameRegex = /^[a-zA-Z0-9._-]+$/;
		if (!usernameRegex.test(value)) {
			throw new Error(
				'Username can only contain letters, numbers, dots, underscores, and hyphens',
			);
		}
		super({ value });
	}

	override valueOf(): string {
		return this.props.value;
	}
}

/**
 * First name value object with validation
 */
export class FirstName extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('First name cannot be empty');
		}
		if (value.length > 100) {
			throw new Error('First name cannot exceed 100 characters');
		}
		super({ value: value.trim() });
	}

	override valueOf(): string {
		return this.props.value;
	}
}

/**
 * Last name value object with validation
 */
export class LastName extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('Last name cannot be empty');
		}
		if (value.length > 100) {
			throw new Error('Last name cannot exceed 100 characters');
		}
		super({ value: value.trim() });
	}

	override valueOf(): string {
		return this.props.value;
	}
}
