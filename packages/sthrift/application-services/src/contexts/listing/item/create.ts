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
    type HelperFn = (
      c: ItemListingCreateCommand,
    ) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;

    const helper = dataSources.domainDataSource.Listing.ItemListing
      .create as unknown as HelperFn | undefined;
    if (!helper) throw new Error('persistence helper ItemListing.create not implemented');

    const res = await helper(command);
    return res;
  };
};
