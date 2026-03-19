import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import * as PersonalUser from './personal-user/index.ts';
import * as AdminUser from './admin-user/index.ts';

export const UserContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	PersonalUser: PersonalUser.PersonalUserPersistence(models, passport),
	AdminUser: AdminUser.AdminUserPersistence(models, passport),
});
