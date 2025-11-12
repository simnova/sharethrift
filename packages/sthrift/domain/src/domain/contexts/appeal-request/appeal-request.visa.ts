import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { AppealRequestDomainPermissions } from './appeal-request.domain-permissions.ts';

export interface AppealRequestVisa
	extends PassportSeedwork.Visa<AppealRequestDomainPermissions> {
	determineIf(
		func: (permissions: Readonly<AppealRequestDomainPermissions>) => boolean,
	): boolean;
}
