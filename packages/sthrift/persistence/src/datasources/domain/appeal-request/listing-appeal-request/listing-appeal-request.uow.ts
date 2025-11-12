import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';

import { ListingAppealRequestConverter } from './listing-appeal-request.domain-adapter.ts';
import { ListingAppealRequestRepository } from './listing-appeal-request.repository.ts';

export const getListingAppealRequestUnitOfWork = (
	listingAppealRequestModel: Models.AppealRequest.ListingAppealRequestModelType,
	passport: Domain.Passport,
): Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		listingAppealRequestModel,
		new ListingAppealRequestConverter(),
		ListingAppealRequestRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
