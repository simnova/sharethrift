import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleContentPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canViewReports: boolean;
	canModerateListings: boolean;
	canModerateConversations: boolean;
	canModerateReservations: boolean;
	canDeleteContent: boolean;
}

export interface AdminRoleContentPermissionsEntityReference
	extends Readonly<AdminRoleContentPermissionsProps> {}

export class AdminRoleContentPermissions
	extends DomainSeedwork.ValueObject<AdminRoleContentPermissionsProps>
	implements AdminRoleContentPermissionsEntityReference
{
	get canViewReports(): boolean {
		return this.props.canViewReports;
	}
	set canViewReports(value: boolean) {
		this.props.canViewReports = value;
	}

	get canModerateListings(): boolean {
		return this.props.canModerateListings;
	}
	set canModerateListings(value: boolean) {
		this.props.canModerateListings = value;
	}

	get canModerateConversations(): boolean {
		return this.props.canModerateConversations;
	}
	set canModerateConversations(value: boolean) {
		this.props.canModerateConversations = value;
	}

	get canModerateReservations(): boolean {
		return this.props.canModerateReservations;
	}
	set canModerateReservations(value: boolean) {
		this.props.canModerateReservations = value;
	}

	get canDeleteContent(): boolean {
		return this.props.canDeleteContent;
	}
	set canDeleteContent(value: boolean) {
		this.props.canDeleteContent = value;
	}
}
