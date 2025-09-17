import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { Domain } from '@sthrift/api-domain';

export class ItemListingRepository<
		PropType extends Domain.Contexts.Listing.ItemListing.ItemListingProps,
	>
	extends MongooseSeedwork.MongoRepositoryBase<
		Models.Listing.ItemListing,
		PropType,
		Domain.Passport,
		Domain.Contexts.Listing.ItemListing.ItemListing<PropType>
	>
	implements Domain.Contexts.Listing.ItemListing.ItemListingRepository<PropType>
{
	async getById(
		id: string,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListing<PropType>> {
		const user = await this.model.findOne({ _id: id }).exec();
		if (!user) {
			throw new Error(`Listing with id ${id} not found`);
		}
		return this.typeConverter.toDomain(user, this.passport);
	}

	// biome-ignore lint:noRequireAwait
	async getNewInstance(
		sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		fields: {
			title: string;
			description: string;
			category: string;
			location: string;
			sharingPeriodStart: Date;
			sharingPeriodEnd: Date;
			images?: string[];
			isDraft?: boolean;
		},
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListing<PropType>> {
		return Promise.resolve(
			Domain.Contexts.Listing.ItemListing.ItemListing.getNewInstance(
				sharer,
				fields,
				this.passport,
			),
		);
	}

	async getActiveItemListings() {
		const mongoItems = await this.model.find({ state: 'Published' }).exec();
		return mongoItems.map((item) =>
			this.typeConverter.toDomain(item, this.passport),
		);
	}

	async getBySharerID(
		sharerId: string,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListing<PropType>[]> {
		const mongoItems = await this.model.find({ sharer: sharerId }).exec();
		return mongoItems.map((item) =>
			this.typeConverter.toDomain(item, this.passport),
		);
	}
}
