import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import { PersonalUserReadRepositoryImpl } from './personal-user/index.ts';
import { AdminUserReadRepositoryImpl } from './admin-user/index.ts';

export const UserContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const personalUserRepo = PersonalUserReadRepositoryImpl(models, passport);
	const adminUserRepo = AdminUserReadRepositoryImpl(models, passport);

	return {
		PersonalUser: personalUserRepo,
		AdminUser: adminUserRepo,

		// Helper: Get user by ID (checks both PersonalUser and AdminUser)
		getUserById: async (
			id: string,
		): Promise<Domain.Contexts.User.UserEntityReference | null> => {
			// Try PersonalUser first
			const personalUser =
				await personalUserRepo.PersonalUserReadRepo.getById(id);
			if (personalUser) {
				return personalUser;
			}

			// Try AdminUser
			return adminUserRepo.AdminUserReadRepo.getById(id);
		},

		// Helper: Get user by email (checks both PersonalUser and AdminUser)
		getUserByEmail: async (
			email: string,
		): Promise<Domain.Contexts.User.UserEntityReference | null> => {
			// Try PersonalUser first
			const personalUser =
				await personalUserRepo.PersonalUserReadRepo.getByEmail(email);
			if (personalUser) {
				return personalUser;
			}

			// Try AdminUser
			return adminUserRepo.AdminUserReadRepo.getByEmail(email);
		},
	};
};
