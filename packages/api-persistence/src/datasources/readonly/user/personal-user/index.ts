import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { getPersonalUserReadRepository } from './personal-user.read-repository.ts';

export type { PersonalUserReadRepository } from './personal-user.read-repository.ts';

export const PersonalUserReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		PersonalUserReadRepo: getPersonalUserReadRepository(models, passport),
	};
};
