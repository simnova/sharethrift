import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { 
  ItemListingUnitOfWork,
  ItemListingProps,
  ItemListingRepository
} from '@ocom/api-domain';
import { ItemListingRepositoryImpl } from '@ocom/api-data-sources-mongoose-models/src/models/item-listing/item-listing.repository.ts';

export const getItemListingUnitOfWork = (
  mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
): ItemListingUnitOfWork<ItemListingProps> => {
  if (!mongooseContextFactory) {
    throw new Error('MongooseContextFactory is required for ItemListing UoW');
  }

  // Get the mongoose context to access models
  const mongooseContext = mongooseContextFactory.service;
  const itemListingModel = mongooseContext.models['ItemListing'] as any;

  // Create passport factory - simplified for now
  const createPassport = (): ItemListingProps => {
    // Create a minimal ItemListingProps implementation for passport
    return {
      sharer: '',
      title: {} as any,
      description: {} as any,
      category: {} as any,
      location: {} as any,
      sharingPeriodStart: new Date(),
      sharingPeriodEnd: new Date(),
      state: {} as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      schemaVersion: 1,
      version: 0,
      id: '',
      sharingHistory: [],
      reports: 0,
      images: [],
    } as ItemListingProps;
  };

  const repository = new ItemListingRepositoryImpl(
    itemListingModel,
    createPassport,
  ) as unknown as ItemListingRepository<ItemListingProps>;

  return {
    itemListingRepository: repository,
    async withTransaction<T>(
      func: (uow: ItemListingUnitOfWork<ItemListingProps>) => Promise<T>,
    ): Promise<T> {
      // For now, execute without actual transaction - can be enhanced later
      return func({
        itemListingRepository: repository,
        withTransaction: this.withTransaction.bind(this),
      });
    },
  };
};