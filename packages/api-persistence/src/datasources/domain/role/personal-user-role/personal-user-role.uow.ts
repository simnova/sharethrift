import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import type { Domain } from '@sthrift/api-domain';
import { PersonalUserRoleConverter } from './personal-user-role.domain-adapter.ts';
import { PersonalUserRoleRepository } from './personal-user-role.repository.ts';

export const getEndUserRoleUnitOfWork = (
	endUserRoleModel: Models.Role.PersonalUserRoleModelType,
	passport: Domain.Passport,
): Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		endUserRoleModel,
		new PersonalUserRoleConverter(),
		PersonalUserRoleRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
