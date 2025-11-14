import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';

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
		sharer: Domain.Contexts.User.UserEntityReference,
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
		// Create a new Mongoose document
		const newDoc = new this.model({
			sharer: sharer.id,
			title: fields.title,
			description: fields.description,
			category: fields.category,
			location: fields.location,
			sharingPeriodStart: fields.sharingPeriodStart,
			sharingPeriodEnd: fields.sharingPeriodEnd,
			images: fields.images ?? [],
			state: fields.isDraft ? 'Drafted' : 'Published',
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: 1,
			reports: 0,
			sharingHistory: [],
		});

		// Use the type converter to create the domain entity from the document
		return this.typeConverter.toDomain(newDoc, this.passport);
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
		_sharerId: string,
		options: {
			page: number;
			pageSize: number;
			searchText?: string;
			statusFilters?: string[];
			sorter?: { field: string; order: 'ascend' | 'descend' };
		},
	): Promise<{
		items: Domain.Contexts.Listing.ItemListing.ItemListing<PropType>[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		// Build MongoDB query
		const query: Record<string, unknown> = {};

		// Add search text filter
		if (options.searchText) {
			// biome-ignore lint/complexity/useLiteralKeys: MongoDB query uses index signature
			query['$or'] = [
				{ title: { $regex: options.searchText, $options: 'i' } },
				{ description: { $regex: options.searchText, $options: 'i' } },
				{ category: { $regex: options.searchText, $options: 'i' } },
				{ location: { $regex: options.searchText, $options: 'i' } },
			];
		}

		// Add status filters
		if (options.statusFilters && options.statusFilters.length > 0) {
			// biome-ignore lint/complexity/useLiteralKeys: MongoDB query uses index signature
			query['state'] = { $in: options.statusFilters };
		}

		// Build sort criteria - simplified to use direct field assignment
		const sort: Record<string, 1 | -1> = {};
		if (options.sorter) {
			const direction = options.sorter.order === 'ascend' ? 1 : -1;
			// Map GraphQL field names to MongoDB field names
			const fieldMapping: Record<string, string> = {
				publishedAt: 'createdAt',
				status: 'state',
			};
			const mongoField =
				fieldMapping[options.sorter.field] || options.sorter.field;
			sort[mongoField] = direction;
		} else {
			// biome-ignore lint/complexity/useLiteralKeys: MongoDB sort uses index signature
			sort['createdAt'] = -1; // Default sort by newest
		} // Calculate pagination
		const skip = (options.page - 1) * options.pageSize;

		// Execute queries
		const [mongoItems, total] = await Promise.all([
			this.model
				.find(query)
				.sort(sort)
				.skip(skip)
				.limit(options.pageSize)
				.exec(),
			this.model.countDocuments(query).exec(),
		]);

		// Convert to domain objects
		const domainItems = mongoItems.map((item: Models.Listing.ItemListing) =>
			this.typeConverter.toDomain(item, this.passport),
		);

		return {
			items: domainItems,
			total,
			page: options.page,
			pageSize: options.pageSize,
		};
	}
}
