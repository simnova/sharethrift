import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleReservationRequestPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canModerateReservations: boolean;
}

export interface AdminRoleReservationRequestPermissionsEntityReference
	extends Readonly<AdminRoleReservationRequestPermissionsProps> {}

export class AdminRoleReservationRequestPermissions
	extends DomainSeedwork.ValueObject<AdminRoleReservationRequestPermissionsProps>
	implements AdminRoleReservationRequestPermissionsEntityReference
{
	get canModerateReservations(): boolean {
		return this.props.canModerateReservations;
	}
	set canModerateReservations(value: boolean) {
		this.props.canModerateReservations = value;
	}
}
