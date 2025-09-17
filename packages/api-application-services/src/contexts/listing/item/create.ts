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
	isDraft?: boolean;
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
				const newItemListing = await repo.getNewInstance(sharer, {
					title: command.title,
					description: command.description,
					category: command.category,
					location: command.location,
					sharingPeriodStart: command.sharingPeriodStart,
					sharingPeriodEnd: command.sharingPeriodEnd,
					images: command.images,
					isDraft: command.isDraft,
				});

				itemListingToReturn = await repo.save(newItemListing);
			},
		);
		if (!itemListingToReturn) {
			throw new Error('ItemListing not created');
		}
		return itemListingToReturn;
	};
};
