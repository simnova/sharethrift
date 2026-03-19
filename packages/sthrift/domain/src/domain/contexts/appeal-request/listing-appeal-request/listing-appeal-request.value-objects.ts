import { DomainSeedwork } from '@cellix/domain-seedwork';

/**
 * Value objects for ListingAppealRequest aggregate validation and data integrity.
 */

/**
 * Appeal request state enumeration
 */
export const AppealRequestState = {
	REQUESTED: 'requested',
	DENIED: 'denied',
	ACCEPTED: 'accepted',
} as const;

export type AppealRequestState =
	(typeof AppealRequestState)[keyof typeof AppealRequestState];

/**
 * Appeal request type enumeration
 */
export const AppealRequestType = {
	USER: 'user',
	LISTING: 'listing',
} as const;

export type AppealRequestType =
	(typeof AppealRequestType)[keyof typeof AppealRequestType];

/**
 * Reason value object with validation
 */
export class Reason extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!value || value.trim().length === 0) {
			throw new Error('Reason cannot be empty');
		}
		if (value.length < 10) {
			throw new Error('Reason must be at least 10 characters');
		}
		if (value.length > 1000) {
			throw new Error('Reason cannot exceed 1000 characters');
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
		if (
			!Object.values(AppealRequestState).includes(
				value as AppealRequestState,
			)
		) {
			throw new Error(`Invalid state: ${value}`);
		}
		super({ value });
	}

	override valueOf(): string {
		return this.props.value;
	}
}

/**
 * Type value object with validation
 */
export class Type extends DomainSeedwork.ValueObject<{ value: string }> {
	constructor(value: string) {
		if (!Object.values(AppealRequestType).includes(value as AppealRequestType)) {
			throw new Error(`Invalid type: ${value}`);
		}
		super({ value });
	}

	override valueOf(): string {
		return this.props.value;
	}
}
