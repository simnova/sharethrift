import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

import {
	createIfNotExists,
	type PersonalUserCreateCommand,
} from './create-if-not-exists.ts';

export const getByEmail = (dataSources: DataSources) => {
	return async (
		email: string,
	): Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null> => {
		return await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail(
			email,
		);
	};
};

export interface PersonalUserApplicationService {
	createIfNotExists: (
		command: PersonalUserCreateCommand,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference>;
	getByEmail: (
		email: string,
	) => Promise<Domain.Contexts.User.PersonalUser.PersonalUserEntityReference | null>;
}

export const PersonalUser = (
	dataSources: DataSources,
): PersonalUserApplicationService => {
	return {
		createIfNotExists: createIfNotExists(dataSources),
		getByEmail: getByEmail(dataSources),
	};
};
