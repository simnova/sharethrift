import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../index.ts';
import { PersonalUserReadRepositoryImpl } from './personal-user/index.ts';

export const UserContext = (models: ModelsContext, passport: Domain.Passport) => ({
    PersonalUser: PersonalUserReadRepositoryImpl(models, passport),
});
