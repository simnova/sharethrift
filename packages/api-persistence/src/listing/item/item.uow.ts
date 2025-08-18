import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain } from '@sthrift/api-domain';
import type { ItemListingModels } from '@sthrift/api-data-sources-mongoose-models';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import { ItemListingConverter } from './item.domain-adapter.ts';
import { ItemListingRepository } from './item.repository.ts';

export const getItemListingUnitOfWork = (
	itemListingModel: ItemListingModels.ItemListingModelType,
): Domain.Contexts.ItemListingUnitOfWork => {
	return new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		itemListingModel,
		new ItemListingConverter(),
		ItemListingRepository,
	);
};