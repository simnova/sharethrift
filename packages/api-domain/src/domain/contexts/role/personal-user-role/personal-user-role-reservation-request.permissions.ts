import { DomainSeedwork } from '@cellix/domain-seedwork';
// import type { CommunityVisa } from '../../community.visa'; // Uncomment if you have a visa concept

export interface PersonalUserRoleReversationRequestPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canCloseRequest: boolean;
	canCancelRequest: boolean;
	canAcceptRequest: boolean;
	canRejectRequest: boolean;
	canUpdateRequest: boolean;
}

export interface PersonalUserRoleReversationRequestPermissionsEntityReference
	extends Readonly<PersonalUserRoleReversationRequestPermissionsProps> {}

export class PersonalUserRoleReversationRequestPermissions
	extends DomainSeedwork.ValueObject<PersonalUserRoleReversationRequestPermissionsProps>
	implements PersonalUserRoleReversationRequestPermissionsEntityReference
{
	get canCloseRequest(): boolean {
		return this.props.canCloseRequest;
	}
	set canCloseRequest(value: boolean) {
		this.props.canCloseRequest = value;
	}

	get canCancelRequest(): boolean {
		return this.props.canCancelRequest;
	}
	set canCancelRequest(value: boolean) {
		this.props.canCancelRequest = value;
	}

	get canAcceptRequest(): boolean {
		return this.props.canAcceptRequest;
	}
	set canAcceptRequest(value: boolean) {
		this.props.canAcceptRequest = value;
	}

	get canRejectRequest(): boolean {
		return this.props.canRejectRequest;
	}
	set canRejectRequest(value: boolean) {
		this.props.canRejectRequest = value;
	}

	get canUpdateRequest(): boolean {
		return this.props.canUpdateRequest;
	}
	set canUpdateRequest(value: boolean) {
		this.props.canUpdateRequest = value;
	}
}
