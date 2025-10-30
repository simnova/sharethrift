import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminUserAccountProps extends DomainSeedwork.ValueObjectProps {
	accountType: string;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
}

export interface AdminUserAccountEntityReference
	extends Readonly<AdminUserAccountProps> {}
