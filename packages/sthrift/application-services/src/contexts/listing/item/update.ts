import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ItemListingUpdateCommand {
	id: string;
	title?: string;
	description?: string;
	category?: string;
	location?: string;
	sharingPeriodStart?: Date | string;
	sharingPeriodEnd?: Date | string;
	images?: string[];
	isBlocked?: boolean;
	isDeleted?: boolean;
}

const ensureDate = (value?: Date | string): Date | undefined => {
	if (value === undefined) {
		return undefined;
	}
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		throw new Error('Invalid date supplied for listing update');
	}
	return date;
};

export const update = (dataSources: DataSources) => {
	return async (
		command: ItemListingUpdateCommand,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> => {
		const uow =
			dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
		if (!uow) {
			throw new Error(
				'ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing',
			);
		}

		const sharingPeriodStart = ensureDate(command.sharingPeriodStart);
		const sharingPeriodEnd = ensureDate(command.sharingPeriodEnd);
		let updatedListing:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| undefined;

		await uow.withScopedTransactionById(command.id, async (repo) => {
			const listing = await repo.get(command.id);

			if (command.title !== undefined) {
				listing.title = command.title;
			}
			if (command.description !== undefined) {
				listing.description = command.description;
			}
			if (command.category !== undefined) {
				listing.category = command.category;
			}
			if (command.location !== undefined) {
				listing.location = command.location;
			}
			if (sharingPeriodStart !== undefined) {
				listing.sharingPeriodStart = sharingPeriodStart;
			}
			if (sharingPeriodEnd !== undefined) {
				listing.sharingPeriodEnd = sharingPeriodEnd;
			}
			if (command.images !== undefined) {
				listing.images = [...command.images];
			}
			if (command.isBlocked !== undefined) {
				listing.setBlocked(command.isBlocked);
			}
			if (command.isDeleted === true) {
				listing.requestDelete();
			}

			updatedListing = await repo.save(listing);
		});

		if (!updatedListing) {
			throw new Error('Item listing update failed');
		}

		return updatedListing;
	};
};
