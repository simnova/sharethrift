import type { UserDomainPermissions } from '../../contexts/user/user.domain-permissions.js';
import type { ListingDomainPermissions } from '../../contexts/listing/listing.domain-permissions.js';
import type { ConversationDomainPermissions } from '../../contexts/conversation/conversation.domain-permissions.js';

export type PermissionsSpec =
	| UserDomainPermissions
	| ListingDomainPermissions
	| ConversationDomainPermissions;
export abstract class SystemPassportBase {
	protected readonly permissions: Partial<PermissionsSpec>;
	constructor(permissions?: Partial<PermissionsSpec>) {
		this.permissions = permissions ?? {};
	}
}
