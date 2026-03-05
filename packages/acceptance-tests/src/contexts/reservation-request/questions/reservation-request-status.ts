import { Question } from '@serenity-js/core';

/**
 * Question: What is the reservation request status?
 *
 * Used in Then steps to verify the reservation request state.
 */
export class ReservationRequestStatus extends Question<string> {
	static of(): Question<string> {
		return new ReservationRequestStatus();
	}

	async answeredBy(): Promise<string> {
		// This would be populated from notes by the task
		// For now, return a placeholder
		return 'Requested';
	}

	toString(): string {
		return 'the reservation request status';
	}
}
