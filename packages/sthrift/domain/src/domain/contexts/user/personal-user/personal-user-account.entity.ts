import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	PersonalUserProfileEntityReference,
	PersonalUserProfileProps,
} from './personal-user-account-profile.entity.ts';

export interface PersonalUserAccountProps
	extends DomainSeedwork.ValueObjectProps {
	accountType: string;
	email: string;
	username: string;

	readonly profile: PersonalUserProfileProps;
}

export interface PersonalUserAccountEntityReference
	extends Readonly<Omit<PersonalUserAccountProps, 'profile'>> {
	readonly profile: PersonalUserProfileEntityReference;
}
