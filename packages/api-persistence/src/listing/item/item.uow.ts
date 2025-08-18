import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Domain } from '@sthrift/api-domain';
import { ItemListingModels } from '@sthrift/api-data-sources-mongoose-models';
import { ItemListingConverter, type ItemListingDomainAdapter } from './item.domain-adapter.ts';
import { ItemListingRepository } from './item.repository.ts';

export const getItemListingUnitOfWork = (
	mongooseFactory: MongooseSeedwork.MongooseContextFactory,
): Domain.Contexts.ItemListingUnitOfWork => {
	const itemListingModel = ItemListingModels.ItemListingModelFactory(mongooseFactory);
	
	// Create a mock passport for now - in production this would come from the request context
	const mockPassport = {} as Domain.Contexts.Passport;
	
	const converter = new ItemListingConverter();
	
	const repository = new ItemListingRepository(
		mockPassport,
		itemListingModel,
		converter,
	);
	
	// Create a simple implementation that provides the required interface
	const unitOfWork: Domain.Contexts.ItemListingUnitOfWork = {
		itemListingRepository: repository,
		withTransaction: async <TReturn>(
			_passport: Domain.Contexts.Passport,
			func: (repository: Domain.Contexts.ItemListingRepository<ItemListingDomainAdapter>) => Promise<TReturn>
		): Promise<TReturn> => {
			// Simple implementation without actual transaction for now
			return await func(repository);
		}
	};
	
	return unitOfWork;
};