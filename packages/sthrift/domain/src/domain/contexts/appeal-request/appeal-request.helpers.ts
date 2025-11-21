import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { AppealRequestVisa } from './appeal-request.visa.ts';
import type { PersonalUserEntityReference } from '../user/personal-user/personal-user.entity.ts';
import { PersonalUser } from '../user/personal-user/personal-user.ts';
import type * as ListingValueObjects from './listing-appeal-request/listing-appeal-request.value-objects.ts';
import type * as UserValueObjects from './user-appeal-request/user-appeal-request.value-objects.ts';

/**
 * Shared helper functions for appeal request aggregates.
 * These functions extract common logic to reduce code duplication.
 */

export function getUserReference(
	userProps: PersonalUserEntityReference,
	passport: Passport,
): PersonalUserEntityReference {
	return new PersonalUser(
		// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
		userProps as any,
		passport,
	) as PersonalUserEntityReference;
}

export function getBlockerReference(
	blockerProps: PersonalUserEntityReference,
	passport: Passport,
): PersonalUserEntityReference {
	return new PersonalUser(
		// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
		blockerProps as any,
		passport,
	) as PersonalUserEntityReference;
}

export function updateReason(
	props: { reason: string },
	value: string,
	visa: AppealRequestVisa,
	ValueObjectClass: typeof ListingValueObjects.Reason | typeof UserValueObjects.Reason,
): void {
	if (
		!visa.determineIf(
			(permissions) => permissions.canUpdateAppealRequestState,
		)
	) {
		throw new DomainSeedwork.PermissionError(
			'You do not have permission to update the reason',
		);
	}
	props.reason = new ValueObjectClass(value).valueOf();
}

export function updateState(
	props: { state: string },
	value: string,
	visa: AppealRequestVisa,
	ValueObjectClass: typeof ListingValueObjects.State | typeof UserValueObjects.State,
): void {
	if (
		!visa.determineIf(
			(permissions) => permissions.canUpdateAppealRequestState,
		)
	) {
		throw new DomainSeedwork.PermissionError(
			'You do not have permission to update the state',
		);
	}
	props.state = new ValueObjectClass(value).valueOf();
}
