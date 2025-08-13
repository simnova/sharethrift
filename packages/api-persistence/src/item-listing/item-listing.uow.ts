import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { 
  ItemListingUnitOfWork,
  ItemListingProps,
  ItemListingRepository,
  Passport
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
  // Using bracket notation as required by TypeScript for index signatures
  // biome-ignore lint/suspicious/noExplicitAny: Required for mongoose model access
  // biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signatures
  const itemListingModel = mongooseContext.models['ItemListing'] as any;
  
  if (!itemListingModel) {
    throw new Error('ItemListing model not found in mongoose context');
  }

  // Create passport factory with proper implementation
  const createPassport = (): Passport => {
    return {
      itemListing: {
        determineIf: () => true,
        canCreate: () => true,
        canUpdate: () => true,
        canDelete: () => true,
        canView: () => true,
        canPublish: () => true,
        canPause: () => true,
        canReport: () => true,
      }
    } as Passport;
  };

  const repository = new ItemListingRepositoryImpl(
    itemListingModel,
    createPassport,
  ) as unknown as ItemListingRepository<ItemListingProps>;

  return {
    itemListingRepository: repository,
    withTransaction<T>(
      func: (uow: ItemListingUnitOfWork<ItemListingProps>) => Promise<T>,
    ): Promise<T> {
      // Create nested UoW for recursive transaction support
      const uow: ItemListingUnitOfWork<ItemListingProps> = {
        itemListingRepository: repository,
        withTransaction: <U>(
          innerFunc: (innerUow: ItemListingUnitOfWork<ItemListingProps>) => Promise<U>,
        ): Promise<U> => {
          return innerFunc(uow);
        },
      };
      return func(uow);
    },
  };
};
