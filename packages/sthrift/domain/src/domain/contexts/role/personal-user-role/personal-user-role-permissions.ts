import type { PersonalUserRoleAccountPlanPermissionsProps } from './personal-user-role-account-plan-permissions.ts';
import type {
	PersonalUserRoleUserPermissionsProps,
	PersonalUserRoleUserPermissionsEntityReference,
} from './personal-user-role-user-permissions.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

import type {
	PersonalUserRoleListingPermissionsProps,
	PersonalUserRoleListingPermissionsEntityReference,
} from './personal-user-role-listing-permissions.ts';
import { PersonalUserRoleListingPermissions } from './personal-user-role-listing-permissions.ts';

import type {
	PersonalUserRoleConversationPermissionsProps,
	PersonalUserRoleConversationPermissionsEntityReference,
} from './personal-user-role-conversation-permissions.ts';
import { PersonalUserRoleConversationPermissions } from './personal-user-role-conversation-permissions.ts';

import type {
	PersonalUserRoleReservationRequestPermissionsProps,
	PersonalUserRoleReservationRequestPermissionsEntityReference,
} from './personal-user-role-reservation-request-permissions.ts';
import { PersonalUserRoleReservationRequestPermissions } from './personal-user-role-reservation-request-permissions.ts';
export interface PersonalUserRolePermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	readonly listingPermissions: PersonalUserRoleListingPermissionsProps;
	readonly conversationPermissions: PersonalUserRoleConversationPermissionsProps;
	readonly reservationRequestPermissions: PersonalUserRoleReservationRequestPermissionsProps;
	readonly userPermissions: PersonalUserRoleUserPermissionsProps;
	readonly accountPlanPermissions: PersonalUserRoleAccountPlanPermissionsProps;
}

export interface PersonalUserRolePermissionsEntityReference
	extends Readonly<
		Omit<
			PersonalUserRolePermissionsProps,
			| 'listingPermissions'
			| 'conversationPermissions'
			| 'reservationRequestPermissions'
			| 'userPermissions'
		>
	> {
	readonly listingPermissions: PersonalUserRoleListingPermissionsEntityReference;
	readonly conversationPermissions: PersonalUserRoleConversationPermissionsEntityReference;
	readonly reservationRequestPermissions: PersonalUserRoleReservationRequestPermissionsEntityReference;
	readonly userPermissions: PersonalUserRoleUserPermissionsEntityReference;
}

export class PersonalUserRolePermissions
	extends DomainSeedwork.ValueObject<PersonalUserRolePermissionsProps>
	implements PersonalUserRolePermissionsEntityReference
{
	get listingPermissions(): PersonalUserRoleListingPermissionsProps {
		return new PersonalUserRoleListingPermissions(
			this.props.listingPermissions,
		);
	}

	get conversationPermissions(): PersonalUserRoleConversationPermissionsProps {
		return new PersonalUserRoleConversationPermissions(
			this.props.conversationPermissions,
		);
	}

	get reservationRequestPermissions(): PersonalUserRoleReservationRequestPermissionsProps {
		return new PersonalUserRoleReservationRequestPermissions(
			this.props.reservationRequestPermissions,
		);
	}

	get userPermissions(): PersonalUserRoleUserPermissionsProps {
		return this.props.userPermissions;
	}

	get accountPlanPermissions(): PersonalUserRoleAccountPlanPermissionsProps {
		return this.props.accountPlanPermissions;
	}
}
