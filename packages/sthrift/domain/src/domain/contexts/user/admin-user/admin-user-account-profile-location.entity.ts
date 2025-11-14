import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminUserAccountProfileLocationProps
	extends DomainSeedwork.ValueObjectProps {
	address1: string;
	address2: string | null;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}

export interface AdminUserAccountProfileLocationEntityReference
	extends Readonly<AdminUserAccountProfileLocationProps> {}
