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

export const create = (dataSources: DataSources) => {
	return async (
		command: ItemListingCreateCommand,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> => {
		let itemListingToReturn:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| undefined;
		await dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction(
			async (repo) => {
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
				if (command.images) {
					fields.images = command.images;
				}
				if (command.isDraft !== undefined) {
					fields.isDraft = command.isDraft;
				}
				const newItemListing = await repo.getNewInstance(
					command.sharer,
					fields,
				);

				itemListingToReturn = await repo.save(newItemListing);
			},
		);
		if (!itemListingToReturn) {
			throw new Error('ItemListing not created');
		}
		return itemListingToReturn;
	};
};
