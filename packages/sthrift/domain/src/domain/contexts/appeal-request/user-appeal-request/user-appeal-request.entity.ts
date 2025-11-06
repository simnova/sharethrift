import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';

export interface UserAppealRequestProps
	extends DomainSeedwork.DomainEntityProps {
	user: Readonly<PersonalUserEntityReference>;
	loadUser: () => Promise<Readonly<PersonalUserEntityReference>>;
	reason: string;
	state: string;
	type: string;
	blocker: Readonly<PersonalUserEntityReference>;
	loadBlocker: () => Promise<Readonly<PersonalUserEntityReference>>;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: string;
}

export interface UserAppealRequestEntityReference
	extends Readonly<UserAppealRequestProps> {}
