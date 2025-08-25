import type { UserDomainPermissions } from '../../contexts/user/user.domain-permissions.ts';

export type PermissionsSpec = UserDomainPermissions;
export abstract class SystemPassportBase {
	protected readonly permissions: Partial<PermissionsSpec>;
	constructor(permissions?: Partial<PermissionsSpec>) {
		this.permissions = permissions ?? {};
	}
}
