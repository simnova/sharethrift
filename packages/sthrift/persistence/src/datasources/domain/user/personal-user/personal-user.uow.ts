import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';

import { PersonalUserConverter } from './personal-user.domain-adapter.ts';
import { PersonalUserRepository } from './personal-user.repository.ts';

export const getPersonalUserUnitOfWork = (
	personalUserModel: Models.User.PersonalUserModelType,
	passport: Domain.Passport,
): Domain.Contexts.User.PersonalUser.PersonalUserUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		personalUserModel,
		new PersonalUserConverter(),
		PersonalUserRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
