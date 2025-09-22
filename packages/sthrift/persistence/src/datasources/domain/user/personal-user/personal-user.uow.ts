import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';

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
