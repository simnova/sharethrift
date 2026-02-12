import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleReservationRequestPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canViewAllReservations: boolean;
	canApproveReservations: boolean;
	canRejectReservations: boolean;
	canCancelReservations: boolean;
	canEditReservations: boolean;
	canModerateReservations: boolean;
}

export interface AdminRoleReservationRequestPermissionsEntityReference
	extends Readonly<AdminRoleReservationRequestPermissionsProps> {}

export class AdminRoleReservationRequestPermissions
	extends DomainSeedwork.ValueObject<AdminRoleReservationRequestPermissionsProps>
	implements AdminRoleReservationRequestPermissionsEntityReference
{
	get canViewAllReservations(): boolean {
		return this.props.canViewAllReservations;
	}
	set canViewAllReservations(value: boolean) {
		this.props.canViewAllReservations = value;
	}

	get canApproveReservations(): boolean {
		return this.props.canApproveReservations;
	}
	set canApproveReservations(value: boolean) {
		this.props.canApproveReservations = value;
	}

	get canRejectReservations(): boolean {
		return this.props.canRejectReservations;
	}
	set canRejectReservations(value: boolean) {
		this.props.canRejectReservations = value;
	}

	get canCancelReservations(): boolean {
		return this.props.canCancelReservations;
	}
	set canCancelReservations(value: boolean) {
		this.props.canCancelReservations = value;
	}

	get canEditReservations(): boolean {
		return this.props.canEditReservations;
	}
	set canEditReservations(value: boolean) {
		this.props.canEditReservations = value;
	}

	get canModerateReservations(): boolean {
		return this.props.canModerateReservations;
	}
	set canModerateReservations(value: boolean) {
		this.props.canModerateReservations = value;
	}
}
