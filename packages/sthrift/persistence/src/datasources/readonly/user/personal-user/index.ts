import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
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
