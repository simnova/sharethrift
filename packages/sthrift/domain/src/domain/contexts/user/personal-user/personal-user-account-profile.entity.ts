import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	PersonalUserAccountProfileBillingEntityReference,
	PersonalUserAccountProfileBillingProps,
} from './personal-user-account-profile-billing.entity.js';
import type {
	PersonalUserAccountProfileLocationEntityReference,
	PersonalUserAccountProfileLocationProps,
} from './personal-user-account-profile-location.entity.js';

export interface PersonalUserProfileProps
	extends DomainSeedwork.ValueObjectProps {
	firstName: string;
	lastName: string;

	readonly location: PersonalUserAccountProfileLocationProps;
	readonly billing: PersonalUserAccountProfileBillingProps;
}

export interface PersonalUserProfileEntityReference
	extends Readonly<Omit<PersonalUserProfileProps, 'location' | 'billing'>> {
	readonly location: PersonalUserAccountProfileLocationEntityReference;
	readonly billing: PersonalUserAccountProfileBillingEntityReference;
}
