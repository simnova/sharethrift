import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	AdminUserProfileEntityReference,
	AdminUserProfileProps,
} from './admin-user-account-profile.entity.ts';

export interface AdminUserAccountProps extends DomainSeedwork.ValueObjectProps {
	accountType: string;
	email: string;
	username: string;
	readonly profile: AdminUserProfileProps;
}

export interface AdminUserAccountEntityReference
	extends Readonly<Omit<AdminUserAccountProps, 'profile'>> {
	readonly profile: AdminUserProfileEntityReference;
}
