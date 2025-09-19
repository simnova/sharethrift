import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../models-context.ts';
import * as PersonalUser from './personal-user/index.ts';

export const UserContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	PersonalUser: PersonalUser.PersonalUserPersistence(models, passport),
});
