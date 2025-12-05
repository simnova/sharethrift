import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getAdminRoleUnitOfWork } from './admin-role.uow.ts';

export const AdminRolePersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const AdminRoleModel = models.Role?.AdminRole;
	return {
		AdminRoleUnitOfWork: getAdminRoleUnitOfWork(AdminRoleModel, passport),
	};
};
