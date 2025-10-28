import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getItemListingUnitOfWork } from './item-listing.uow.ts';

export const ItemListingPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const itemListingModel = models.Listing.ItemListingModel;
	const uow = getItemListingUnitOfWork(itemListingModel, passport);

	return {
		ItemListingUnitOfWork: uow,
		// Expose a small repo object for application-services to use for mutations.
		ItemListingRepo: {
			// Create a new listing inside a scoped transaction. Returns the saved entity reference.
			async create(command: {
				sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
				title: string;
				description: string;
				category: string;
				location: string;
				sharingPeriodStart: Date;
				sharingPeriodEnd: Date;
				images?: string[];
				isDraft?: boolean;
			}) {
				let savedEntityRef: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | undefined;
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
					const newItem = await repo.getNewInstance(command.sharer, fields);
					const savedAggregate = await repo.save(newItem);
					// repo.save returns the aggregate; convert to an entity reference to keep the repo surface lightweight
					savedEntityRef = savedAggregate.getEntityReference();
				});
				if (!savedEntityRef) throw new Error('ItemListing not created');
				return savedEntityRef;
			},
			async remove(id: string) {
				await uow.withScopedTransactionById(id, async (repo) => {
					const listing = await repo.get(id);
					listing.requestDelete?.();
				});
				return true;
			},
			async unblock(id: string) {
				await uow.withScopedTransactionById(id, async (repo) => {
					const listing = await repo.get(id);
					listing.unblock?.();
				});
				return true;
			},
		},
	};
};
