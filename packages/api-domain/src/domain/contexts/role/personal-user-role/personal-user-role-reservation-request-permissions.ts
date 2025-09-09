import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserRoleReservationRequestPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canCreateReservationRequest: boolean;
	canManageReservationRequest: boolean;
	canViewReservationRequest: boolean;
}

export interface PersonalUserRoleReservationRequestPermissionsEntityReference
	extends Readonly<PersonalUserRoleReservationRequestPermissionsProps> {}

export class PersonalUserRoleReservationRequestPermissions
	extends DomainSeedwork.ValueObject<PersonalUserRoleReservationRequestPermissionsProps>
	implements PersonalUserRoleReservationRequestPermissionsEntityReference
{
	get canCreateReservationRequest(): boolean {
		return this.props.canCreateReservationRequest;
	}
	get canManageReservationRequest(): boolean {
		return this.props.canManageReservationRequest;
	}

	set canManageReservationRequest(value: boolean) {
		this.props.canManageReservationRequest = value;
	}

	set canCreateReservationRequest(value: boolean) {
		this.props.canCreateReservationRequest = value;
	}

	set canViewReservationRequest(value: boolean) {
		this.props.canViewReservationRequest = value;
	}
}
