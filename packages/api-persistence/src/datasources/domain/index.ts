import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../index.ts';
import { UserContextPersistence } from './user/index.ts';

export const DomainDataSourceImplementation = (models: ModelsContext, passport: Domain.Passport) => ({
    User: UserContextPersistence(models, passport)
});