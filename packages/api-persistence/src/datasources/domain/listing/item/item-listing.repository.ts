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
	async getNewInstance(): Promise<
		Domain.Contexts.Listing.ItemListing.ItemListing<PropType>
	> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Listing.ItemListing.ItemListing.getNewInstance(
				adapter,
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

// export class ItemListingRepository
// 	implements Domain.Contexts.ItemListingRepository<PropType>
// {
// 	private model: Models.Listing.ItemListingModelType;
// 	private converter: {
// 		toDomain: (
// 			doc: ItemListingModelType,
// 			passport: Domain.Contexts.Passport,
// 		) => Domain.Contexts.ItemListing<PropType>;
// 	};
// 	private passport: Domain.Contexts.Passport;

// 	constructor(
// 		passport: Domain.Contexts.Passport,
// 		model: Models.Listing.ItemListingModelType,
// 		converter: {
// 			toDomain: (
// 				doc: ItemListingModelType,
// 				passport: Domain.Contexts.Passport,
// 			) => Domain.Contexts.ItemListing<PropType>;
// 		},
// 	) {
// 		this.passport = passport;
// 		this.model = model;
// 		this.converter = converter;
// 	}

// 	async get(id: string): Promise<Domain.Contexts.ItemListing<PropType>> {
// 		const mongoItem = await this.model.findById(id).exec();
// 		if (!mongoItem) {
// 			throw new Error(`ItemListing with id ${id} not found`);
// 		}
// 		return this.converter.toDomain(mongoItem, this.passport);
// 	}

// 	async getById(
// 		id: string,
// 	): Promise<Domain.Contexts.ItemListing<PropType> | undefined> {
// 		const mongoItem = await this.model.findById(id).exec();
// 		if (!mongoItem) {
// 			return undefined;
// 		}
// 		return this.converter.toDomain(mongoItem, this.passport);
// 	}

// 	save(
// 		itemListing: Domain.Contexts.ItemListing<PropType>,
// 	): Promise<Domain.Contexts.ItemListing<PropType>> {
// 		// Simple implementation - in production this would handle save logic properly
// 		return Promise.resolve(itemListing);
// 	}

// 	async saveAndGetReference(
// 		itemListing: Domain.Contexts.ItemListing<PropType>,
// 	): Promise<Domain.Contexts.ItemListingEntityReference> {
// 		await this.save(itemListing);
// 		return itemListing.getEntityReference();
// 	}

// 	async findActiveListings(_options: {
// 		search?: string;
// 		category?: string;
// 		first?: number;
// 		after?: string;
// 	}): Promise<{
// 		edges: { node: Domain.Contexts.ItemListing<PropType>; cursor: string }[];
// 		pageInfo: {
// 			hasNextPage: boolean;
// 			hasPreviousPage: boolean;
// 			startCursor?: string;
// 			endCursor?: string;
// 		};
// 		totalCount: number;
// 	}> {
// 		const mongoItems = await this.model.find({ state: 'Published' }).exec();
// 		return {
// 			edges: mongoItems.map((doc) => ({
// 				node: this.converter.toDomain(doc, this.passport),
// 				cursor: String(doc._id),
// 			})),
// 			pageInfo: {
// 				hasNextPage: false, // Implement pagination logic
// 				hasPreviousPage: false, // Implement pagination logic
// 			},
// 			totalCount: mongoItems.length,
// 		};
// 	}

// 	async getBySharerID(
// 		sharerID: string,
// 	): Promise<Domain.Contexts.ItemListing<PropType>[]> {
// 		const mongoItems = await this.model.find({ sharer: sharerID }).exec();
// 		return mongoItems.map((doc) => this.converter.toDomain(doc, this.passport));
// 	}
// }
