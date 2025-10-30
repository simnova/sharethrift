import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';

import { AdminUserConverter } from './admin-user.domain-adapter.ts';
import { AdminUserRepository } from './admin-user.repository.ts';

export const getAdminUserUnitOfWork = (
	adminUserModel: Models.User.AdminUserModelType,
	passport: Domain.Passport,
): Domain.Contexts.User.AdminUser.AdminUserUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		adminUserModel,
		new AdminUserConverter(),
		AdminUserRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
