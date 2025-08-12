import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import type { 
  ItemListingUnitOfWork,
  ItemListingProps,
  ItemListingRepository,
  Passport 
} from '@ocom/api-domain';
import { ItemListingConverter, type ItemListingModel } from './item-listing.domain-adapter.ts';
import { ItemListingRepositoryImpl } from '@ocom/api-data-sources-mongoose-models';

export const getItemListingUnitOfWork = (
  mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
  inProcEventBusInstance: InProcEventBusInstance,
  nodeEventBusInstance: NodeEventBusInstance,
): ItemListingUnitOfWork<ItemListingProps> => {
  if (!mongooseContextFactory?.getContext?.()) {
    throw new Error('MongooseContextFactory is required for ItemListing UoW');
  }

  const mongooseContext = mongooseContextFactory.getContext();
  const itemListingModel = mongooseContext.ItemListingModel as unknown as ItemListingModel;

  // Create passport factory - simplified for now
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

  const mongoUnitOfWork = new MongooseSeedwork.MongoUnitOfWork(
    mongooseContextFactory,
    inProcEventBusInstance,
    nodeEventBusInstance,
  );

  const repository = new ItemListingRepositoryImpl(
    itemListingModel,
    createPassport,
  ) as unknown as ItemListingRepository<ItemListingProps>;

  return {
    itemListingRepository: repository,
    withTransaction<T>(
      func: (uow: ItemListingUnitOfWork<ItemListingProps>) => Promise<T>,
    ): Promise<T> {
      return mongoUnitOfWork.withTransaction(() => {
        return func({
          itemListingRepository: repository,
          withTransaction: this.withTransaction.bind(this),
        });
      });
    },
  };
};