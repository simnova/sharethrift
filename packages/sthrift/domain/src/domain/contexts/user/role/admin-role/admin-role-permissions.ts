import { DomainSeedwork } from '@cellix/domain-seedwork';

import type {
	AdminRoleUserPermissionsProps,
	AdminRoleUserPermissionsEntityReference,
} from './admin-role-user-permissions.ts';
import { AdminRoleUserPermissions } from './admin-role-user-permissions.ts';

import type {
	AdminRoleConversationPermissionsProps,
	AdminRoleConversationPermissionsEntityReference,
} from './admin-role-conversation-permissions.ts';
import { AdminRoleConversationPermissions } from './admin-role-conversation-permissions.ts';

import type {
	AdminRoleListingPermissionsProps,
	AdminRoleListingPermissionsEntityReference,
} from './admin-role-listing-permissions.ts';
import { AdminRoleListingPermissions } from './admin-role-listing-permissions.ts';

import type {
	AdminRoleReservationRequestPermissionsProps,
	AdminRoleReservationRequestPermissionsEntityReference,
} from './admin-role-reservation-request-permissions.ts';
import { AdminRoleReservationRequestPermissions } from './admin-role-reservation-request-permissions.ts';

export interface AdminRolePermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	readonly userPermissions: AdminRoleUserPermissionsProps;
	readonly conversationPermissions: AdminRoleConversationPermissionsProps;
	readonly listingPermissions: AdminRoleListingPermissionsProps;
	readonly reservationRequestPermissions: AdminRoleReservationRequestPermissionsProps;
}

export interface AdminRolePermissionsEntityReference
	extends Readonly<
		Omit<
			AdminRolePermissionsProps,
			| 'userPermissions'
			| 'conversationPermissions'
			| 'listingPermissions'
			| 'reservationRequestPermissions'
		>
	> {
	readonly userPermissions: AdminRoleUserPermissionsEntityReference;
	readonly conversationPermissions: AdminRoleConversationPermissionsEntityReference;
	readonly listingPermissions: AdminRoleListingPermissionsEntityReference;
	readonly reservationRequestPermissions: AdminRoleReservationRequestPermissionsEntityReference;
}

export class AdminRolePermissions
	extends DomainSeedwork.ValueObject<AdminRolePermissionsProps>
	implements AdminRolePermissionsEntityReference
{
	get userPermissions(): AdminRoleUserPermissionsProps {
		return new AdminRoleUserPermissions(this.props.userPermissions);
	}

	get conversationPermissions(): AdminRoleConversationPermissionsProps {
		return new AdminRoleConversationPermissions(
			this.props.conversationPermissions,
		);
	}

	get listingPermissions(): AdminRoleListingPermissionsProps {
		return new AdminRoleListingPermissions(this.props.listingPermissions);
	}

	get reservationRequestPermissions(): AdminRoleReservationRequestPermissionsProps {
		return new AdminRoleReservationRequestPermissions(
			this.props.reservationRequestPermissions,
		);
	}
}
