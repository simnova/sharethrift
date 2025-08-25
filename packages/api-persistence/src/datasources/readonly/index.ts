import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../index.ts';
import type * as PersonalUser from './user/personal-user/index.ts';
import { UserContext } from './user/index.ts';

export interface ReadonlyDataSource {
	User: {
		PersonalUser: {
			PersonalUserReadRepo: PersonalUser.PersonalUserReadRepository;
		};
	};
}

export const ReadonlyDataSourceImplementation = (
	models: ModelsContext,
	passport: Domain.Passport,
): ReadonlyDataSource => ({
	User: UserContext(models, passport),
});
