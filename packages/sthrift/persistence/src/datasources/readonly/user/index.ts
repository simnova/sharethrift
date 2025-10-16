import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { PersonalUserReadRepositoryImpl } from './personal-user/index.ts';
import { AdminUserReadRepositoryImpl } from './admin-user/index.ts';

export const UserContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	PersonalUser: PersonalUserReadRepositoryImpl(models, passport),
	AdminUser: AdminUserReadRepositoryImpl(models, passport),
});
