import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { RoleDomainPermissions } from './role.domain-permissions.ts';

export interface RoleVisa
	extends PassportSeedwork.Visa<RoleDomainPermissions> {
	determineIf(
		func: (permissions: Readonly<RoleDomainPermissions>) => boolean,
	): boolean;
}
