import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getAdminUserReadRepository } from './admin-user.read-repository.ts';

export type { AdminUserReadRepository } from './admin-user.read-repository.ts';

export const AdminUserReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		AdminUserReadRepo: getAdminUserReadRepository(models, passport),
	};
};
