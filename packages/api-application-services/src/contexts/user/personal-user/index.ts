import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

import {
	createIfNotExists,
	type PersonalUserCreateCommand,
} from './create-if-not-exists.ts';

export interface PersonalUserApplicationService {
	createIfNotExists: (
		command: PersonalUserCreateCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
}

export const PersonalUser = (
	dataSources: DataSources,
): PersonalUserApplicationService => {
	return {
		createIfNotExists: createIfNotExists(dataSources),
	};
};
