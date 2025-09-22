import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';

import { ItemListingConverter } from './item-listing.domain-adapter.ts';
import { ItemListingRepository } from './item-listing.repository.ts';

export const getItemListingUnitOfWork = (
	itemListingModel: Models.Listing.ItemListingModelType,
	passport: Domain.Passport,
) => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		itemListingModel,
		new ItemListingConverter(),
		ItemListingRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
