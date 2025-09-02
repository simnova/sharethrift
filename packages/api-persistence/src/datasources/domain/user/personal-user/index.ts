import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { getPersonalUserUnitOfWork } from './personal-user.uow.ts';

export const PersonalUserPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const PersonalUserModel = models.User?.PersonalUser;
	return {
		PersonalUserUnitOfWork: getPersonalUserUnitOfWork(
			PersonalUserModel,
			passport,
		),
	};
};
