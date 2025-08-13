import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { 
  ItemListingUnitOfWork,
  ItemListingProps,
  ItemListingRepository,
  Passport
} from '@ocom/api-domain';
import { ItemListingPassport } from '@ocom/api-domain/src/domain/iam/item-listing/item-listing.passport.ts';
import { ItemListingRepositoryImpl } from '@ocom/api-data-sources-mongoose-models/src/models/item-listing/item-listing.repository.ts';

export const getItemListingUnitOfWork = (
  mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
  _inProcEventBusInstance: unknown,
  _nodeEventBusInstance: unknown,
): ItemListingUnitOfWork<ItemListingProps> => {
  if (!mongooseContextFactory) {
    throw new Error('MongooseContextFactory is required for ItemListing UoW');
  }

  // Get the mongoose context to access models
  const mongooseContext = mongooseContextFactory.service;
  const itemListingModel = mongooseContext.models['ItemListing'] as any;

  // Create passport factory with proper implementation
  const createPassport = (): Passport => {
    // Create default permissions for simplified implementation
    const defaultPermissions = {
      canCreateItemListing: true,
      canUpdateItemListing: true,
      canDeleteItemListing: true,
      canViewItemListing: true,
      canPublishItemListing: true,
      canPauseItemListing: true,
      canReportItemListing: true,
    };

    // Create default principal for simplified implementation
    const defaultPrincipal = {
      id: 'system',
      email: 'system@example.com',
      roles: ['user'],
    };

    return new ItemListingPassport(defaultPrincipal, defaultPermissions);
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
      const uow: ItemListingUnitOfWork<ItemListingProps> = {
        itemListingRepository: repository,
        withTransaction: async <U>(
          innerFunc: (innerUow: ItemListingUnitOfWork<ItemListingProps>) => Promise<U>,
        ): Promise<U> => {
          return innerFunc(uow);
        },
      };
      return func(uow);
    },
  };
};