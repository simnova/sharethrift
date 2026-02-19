import type { UserDomainPermissions } from '../../contexts/user/user.domain-permissions.ts';
import type { ListingDomainPermissions } from '../../contexts/listing/listing.domain-permissions.ts';
import type { ConversationDomainPermissions } from '../../contexts/conversation/conversation.domain-permissions.ts';

import type { ReservationRequestDomainPermissions } from '../../contexts/reservation-request/reservation-request.domain-permissions.ts';

export type PermissionsSpec =
	| UserDomainPermissions
	| ListingDomainPermissions
	| ConversationDomainPermissions
	| ReservationRequestDomainPermissions;
export abstract class SystemPassportBase {
	protected readonly permissions: Partial<PermissionsSpec>;
	constructor(permissions?: Partial<PermissionsSpec>) {
		this.permissions = permissions ?? {};
	}
}
