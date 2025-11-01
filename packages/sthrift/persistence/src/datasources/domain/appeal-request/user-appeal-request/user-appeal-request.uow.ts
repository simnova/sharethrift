import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';

import { UserAppealRequestConverter } from './user-appeal-request.domain-adapter.ts';
import { UserAppealRequestRepository } from './user-appeal-request.repository.ts';

export const getUserAppealRequestUnitOfWork = (
	userAppealRequestModel: Models.AppealRequest.UserAppealRequestModelType,
	passport: Domain.Passport,
): Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		userAppealRequestModel,
		new UserAppealRequestConverter(),
		UserAppealRequestRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
