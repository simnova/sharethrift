import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	PersonalUserAccountEntityReference,
	PersonalUserAccountProps,
} from './personal-user-account.entity.ts';
import type { PersonalUserRoleEntityReference } from '../../role/personal-user-role/personal-user-role.entity.ts';

export interface PersonalUserProps extends DomainSeedwork.DomainEntityProps {
	userType: string;
	isBlocked: boolean;
	hasCompletedOnboarding: boolean;
	role: Readonly<PersonalUserRoleEntityReference>;
	loadRole: () => Promise<Readonly<PersonalUserRoleEntityReference>>;

	readonly account: PersonalUserAccountProps;

	readonly schemaVersion: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface PersonalUserEntityReference
	extends Readonly<Omit<PersonalUserProps, 'account' | 'role'>> {
	readonly account: PersonalUserAccountEntityReference;
	readonly role: PersonalUserRoleEntityReference;
}
