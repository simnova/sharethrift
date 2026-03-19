import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { PersonalUserReadRepositoryImpl } from './personal-user/index.ts';
import { AdminUserReadRepositoryImpl } from './admin-user/index.ts';
import { UserReadRepositoryImpl } from './user/index.ts';

export function UserContext(
	models: ModelsContext,
	passport: Domain.Passport,
) {
	const personalUserRepo = PersonalUserReadRepositoryImpl(models, passport);
	const adminUserRepo = AdminUserReadRepositoryImpl(models, passport);
  const userRepo = UserReadRepositoryImpl(models, passport);

	return {
		PersonalUser: personalUserRepo,
		AdminUser: adminUserRepo,
    User: userRepo,
	};
};
