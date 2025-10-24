import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	PersonalUserAccountEntityReference,
	PersonalUserAccountProps,
} from './personal-user-account.entity.ts';

export interface PersonalUserProps extends DomainSeedwork.DomainEntityProps {
	userType: string;
	isBlocked: boolean;
	hasCompletedOnboarding: boolean;

	readonly account: PersonalUserAccountProps;

	readonly schemaVersion: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface PersonalUserEntityReference
	extends Readonly<Omit<PersonalUserProps, 'account'>> {
	readonly account: PersonalUserAccountEntityReference;
}
