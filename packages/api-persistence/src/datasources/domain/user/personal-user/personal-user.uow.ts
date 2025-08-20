import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import { Domain } from '@sthrift/api-domain';
import { PersonalUserRepositoryImpl } from './personal-user.repository.ts';
import type { PersonalUserModelType } from '@sthrift/api-data-sources-mongoose-models';

export const getPersonalUserUnitOfWork = (
	model: PersonalUserModelType,
	inProcEventBusInstance: DomainSeedwork.EventBus,
	nodeEventBusInstance: DomainSeedwork.EventBus,
): Domain.Contexts.User.PersonalUser.PersonalUserUnitOfWork => {
	const repository = new PersonalUserRepositoryImpl<Domain.Contexts.User.PersonalUser.PersonalUserProps>(model);
	
	return new MongooseSeedwork.MongoUnitOfWork<
		Domain.Passport,
		Domain.Contexts.User.PersonalUser.PersonalUserProps,
		Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>,
		Domain.Contexts.User.PersonalUser.PersonalUserRepository<Domain.Contexts.User.PersonalUser.PersonalUserProps>
	>(
		repository,
		inProcEventBusInstance,
		nodeEventBusInstance,
	);
};