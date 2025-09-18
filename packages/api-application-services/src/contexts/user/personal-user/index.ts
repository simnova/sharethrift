import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type PersonalUserQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	createIfNotExists,
	type PersonalUserCreateCommand,
} from './create-if-not-exists.ts';

import { update, type PersonalUserUpdateCommand } from './update.ts';
export interface PersonalUserApplicationService {
	createIfNotExists: (
		command: PersonalUserCreateCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
	queryById: (
		command: PersonalUserQueryByIdCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
	update: (
		command: PersonalUserUpdateCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
}

export const PersonalUser = (
	dataSources: DataSources,
): PersonalUserApplicationService => {
	return {
		createIfNotExists: createIfNotExists(dataSources),
		queryById: queryById(dataSources),
		update: update(dataSources),
	};
};
