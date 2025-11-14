import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	AdminUserAccountProfileLocationEntityReference,
	AdminUserAccountProfileLocationProps,
} from './admin-user-account-profile-location.entity.ts';

export interface AdminUserProfileProps extends DomainSeedwork.ValueObjectProps {
	firstName: string;
	lastName: string;
	aboutMe: string;

	readonly location: AdminUserAccountProfileLocationProps;
}

export interface AdminUserProfileEntityReference
	extends Readonly<Omit<AdminUserProfileProps, 'location'>> {
	readonly location: AdminUserAccountProfileLocationEntityReference;
}
