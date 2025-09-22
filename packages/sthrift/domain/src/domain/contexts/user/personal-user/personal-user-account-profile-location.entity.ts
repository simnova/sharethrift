import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserAccountProfileLocationProps
	extends DomainSeedwork.ValueObjectProps {
	address1: string;
	address2: string | null;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}

export interface PersonalUserAccountProfileLocationEntityReference
	extends Readonly<PersonalUserAccountProfileLocationProps> {}
