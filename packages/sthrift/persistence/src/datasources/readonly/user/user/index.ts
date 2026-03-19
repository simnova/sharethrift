import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getUserReadRepository } from './user.read-repository.ts';

export type { UserReadRepository } from './user.read-repository.ts';

export const UserReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		UserReadRepo: getUserReadRepository(models, passport),
	};
};
