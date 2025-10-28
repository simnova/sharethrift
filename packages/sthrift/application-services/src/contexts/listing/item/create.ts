import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingCreateCommand {
  sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  images?: string[];
  isDraft?: boolean;
}

// NOTE for future maintainers:
// This application-service intentionally delegates `create` to the persistence
// layer. The persistence helper owns UnitOfWork/transaction boundaries and the
// authoritative mapping/instantiation logic for ItemListing entities.
//
// When modifying or refactoring this operation in the future, reference the
// persistence helper at:
//   packages/sthrift/persistence/src/datasources/domain/listing/item/index.ts
//
// Motivation: keeping transactions and repository logic inside persistence
// reduces duplication and ensures consistency with remove/unblock helpers.
// Do NOT reintroduce UnitOfWork/withScopedTransaction usage here — add new
// behaviors in the persistence helper and keep the application-service thin.
//
// Delegate create to persistence helper which owns the UnitOfWork/transaction.
export const create = (dataSources: DataSources) => {
  return async (
    command: ItemListingCreateCommand,
  ): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> => {
    let itemListingToReturn:
      | Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
      | undefined;

    const uow = dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
    if (!uow) throw new Error('ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing');

    await uow.withScopedTransaction(async (repo) => {
      const fields: {
        title: string;
        description: string;
        category: string;
        location: string;
        sharingPeriodStart: Date;
        sharingPeriodEnd: Date;
        images?: string[];
        isDraft?: boolean;
      } = {
        title: command.title,
        description: command.description,
        category: command.category,
        location: command.location,
        sharingPeriodStart: command.sharingPeriodStart,
        sharingPeriodEnd: command.sharingPeriodEnd,
      };
      if (command.images) fields.images = command.images;
      if (command.isDraft !== undefined) fields.isDraft = command.isDraft;

      const newItemListing = await repo.getNewInstance(command.sharer, fields);
      const savedAggregate = await repo.save(newItemListing);
      itemListingToReturn = savedAggregate.getEntityReference();
    });

    if (!itemListingToReturn) {
      throw new Error('ItemListing not created');
    }

    return itemListingToReturn;
  };
};
