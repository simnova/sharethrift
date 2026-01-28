import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getAdminUserUnitOfWork } from './admin-user.uow.ts';

export const AdminUserPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const AdminUserModel = models.User?.AdminUser;
	return {
		AdminUserUnitOfWork: getAdminUserUnitOfWork(AdminUserModel, passport),
	};
};
