import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { getPersonalUserRoleUnitOfWork } from './personal-user-role.uow.ts';

export const PersonalUserRolePersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const PersonalUserRoleModel = models.Role.PersonalUserRole;
	return {
		PersonalUserRoleUnitOfWork: getPersonalUserRoleUnitOfWork(
			PersonalUserRoleModel,
			passport,
		),
	};
};
