import { DomainSeedwork } from '@cellix/domain-seedwork';
import { VOOptional } from '@lucaspaganini/value-objects';
import { Email as EmailBase } from '../../value-objects.ts';
/**
 * Value objects for User aggregate validation and data integrity.
 */

/**
 * User type enumeration
 */
export const UserType = {
	PERSONAL: 'personal',
	ADMIN: 'admin',
} as const;

export type UserType = (typeof UserType)[keyof typeof UserType];

/**
 * Account type enumeration
 */
export const AccountType = {
	PERSONAL: 'personal',
	BUSINESS: 'business',
	ENTERPRISE: 'enterprise',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

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

/**
 * Address value object with validation
 */
export class Address extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('Address cannot be empty');
		}
		if (value.length > 200) {
			throw new Error('Address cannot exceed 200 characters');
		}
		super({ value: value.trim() });
	}

	override valueOf(): string {
		return this.props.value;
	}
}

/**
 * City value object with validation
 */
export class City extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('City cannot be empty');
		}
		if (value.length > 100) {
			throw new Error('City cannot exceed 100 characters');
		}
		super({ value: value.trim() });
	}

	override valueOf(): string {
		return this.props.value;
	}
}

/**
 * State value object with validation
 */
export class State extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('State cannot be empty');
		}
		if (value.length > 100) {
			throw new Error('State cannot exceed 100 characters');
		}
		super({ value: value.trim() });
	}

	override valueOf(): string {
		return this.props.value;
	}
}

/**
 * Country value object with validation
 */
export class Country extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('Country cannot be empty');
		}
		if (value.length > 100) {
			throw new Error('Country cannot exceed 100 characters');
		}
		super({ value: value.trim() });
	}

	override valueOf(): string {
		return this.props.value;
	}
}

/**
 * Zip code value object with validation
 */
export class ZipCode extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('Zip code cannot be empty');
		}
		// Basic zip code validation (US format, but can be extended)
		const zipRegex = /^\d{5}(-\d{4})?$/;
		if (!zipRegex.test(value)) {
			throw new Error('Invalid zip code format');
		}
		super({ value: value.trim() });
	}

	override valueOf(): string {
		return this.props.value;
	}
}
