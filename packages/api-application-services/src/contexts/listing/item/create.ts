import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ItemListingCreateCommand {
	sharerId: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images?: string[];
}

export const create = (dataSources: DataSources) => {
	return async (
		command: ItemListingCreateCommand,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> => {
		const sharer =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
				command.sharerId,
			);
		if (!sharer) {
			throw new Error(
				`Personal user (sharer) not found for external id ${command.sharerId}`,
			);
		}
		let itemListingToReturn:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| undefined;
		await dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newItemListing = await repo.getNewInstance(sharer);

				// Set all the properties from the command
				newItemListing.title = command.title;
				newItemListing.description = command.description;
				newItemListing.category = command.category;
				newItemListing.location = command.location;
				newItemListing.sharingPeriodStart = command.sharingPeriodStart;
				newItemListing.sharingPeriodEnd = command.sharingPeriodEnd;
				if (command.images && command.images.length > 0) {
					newItemListing.images = command.images;
				}

				itemListingToReturn = await repo.save(newItemListing);
			},
		);
		if (!itemListingToReturn) {
			throw new Error('ItemListing not created');
		}
		return itemListingToReturn;
	};
};
