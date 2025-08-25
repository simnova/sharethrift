import type { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';

import { PersonalUserConverter } from './personal-user.domain-adapter.ts';
import { PersonalUserRepository } from './personal-user.repository.ts';

export const getPersonalUserUnitOfWork = (
    personalUserModel: Models.User.PersonalUserModelType,
    passport: Domain.Passport
) => {
    const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
        InProcEventBusInstance,
        NodeEventBusInstance,
        personalUserModel,
        new PersonalUserConverter(),
        PersonalUserRepository,
    );
    return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
}