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
}

export interface PersonalUserRolePermissionsEntityReference
	extends Readonly<
		Omit<
			PersonalUserRolePermissionsProps,
			| 'listingPermissions'
			| 'conversationPermissions'
			| 'reservationRequestPermissions'
		>
	> {
	readonly listingPermissions: PersonalUserRoleListingPermissionsEntityReference;
	readonly conversationPermissions: PersonalUserRoleConversationPermissionsEntityReference;
	readonly reservationRequestPermissions: PersonalUserRoleReservationRequestPermissionsEntityReference;
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
}
