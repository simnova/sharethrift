import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { AdminRoleConverter } from './admin-role.domain-adapter.ts';
import { AdminRoleRepository } from './admin-role.repository.ts';

export const getAdminRoleUnitOfWork = (
	adminRoleModel: Models.Role.AdminRoleModelType,
	passport: Domain.Passport,
): Domain.Contexts.User.Role.AdminRole.AdminRoleUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		adminRoleModel,
		new AdminRoleConverter(),
		AdminRoleRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
