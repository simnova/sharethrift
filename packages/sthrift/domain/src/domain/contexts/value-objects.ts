import { VOString } from '@lucaspaganini/value-objects';
import { DomainSeedwork } from '@cellix/domain-seedwork';

/* Regex Source: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address */
const EMAIL_PATTERN =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const NULLABLE_EMAIL_PATTERN =
	/^$|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export class Email extends VOString({
	trim: true,
	maxLength: 254,
	pattern: EMAIL_PATTERN,
}) {}

export class NullableEmail extends VOString({
	trim: true,
	maxLength: 254,
	pattern: NULLABLE_EMAIL_PATTERN,
}) {}

const GUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class ExternalId extends VOString({
	trim: true,
	minLength: 36,
	maxLength: 36,
	pattern: GUID_PATTERN,
}) {}

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
export class ObjectId extends VOString({
	trim: true,
	minLength: 24,
	maxLength: 24,
	pattern: OBJECT_ID_PATTERN,
}) {}

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
