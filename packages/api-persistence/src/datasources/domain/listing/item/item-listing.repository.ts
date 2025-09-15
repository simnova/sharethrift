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
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListing<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Listing.ItemListing.ItemListing.getNewInstance(
				adapter,
				sharer,
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

	   async getBySharerIDWithPagination(
			   sharerId: string,
			   options: {
					   page: number;
					   pageSize: number;
					   searchText?: string;
					   statusFilters?: string[];
					   sorter?: { field: string; order: 'ascend' | 'descend' };
			   }
	   ): Promise<{
			   items: Domain.Contexts.Listing.ItemListing.ItemListing<PropType>[];
			   total: number;
			   page: number;
			   pageSize: number;
	   }> {
			   // Build MongoDB query
			   const query: Record<string, any> = { sharer: sharerId };
			   if (options.statusFilters && options.statusFilters.length > 0) {
					   query["status"] = { $in: options.statusFilters };
			   }
			   if (options.searchText) {
					   query["title"] = { $regex: options.searchText, $options: "i" };
			   }

			   let mongoQuery = this.model.find(query);

			   // Sorting
			   if (options.sorter?.field) {
					   const sortOrder = options.sorter.order === "ascend" ? 1 : -1;
					   mongoQuery = mongoQuery.sort({ [options.sorter.field]: sortOrder });
			   }

			   // Pagination
			   const skip = (options.page - 1) * options.pageSize;
			   mongoQuery = mongoQuery.skip(skip).limit(options.pageSize);

			   const [items, total] = await Promise.all([
					   mongoQuery.exec(),
					   this.model.countDocuments(query).exec(),
			   ]);

			   return {
					   items: items.map((item) => this.typeConverter.toDomain(item, this.passport)),
					   total,
					   page: options.page,
					   pageSize: options.pageSize,
			   };
	   }
}
