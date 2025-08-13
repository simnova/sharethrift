import type { Model } from 'mongoose';
import {
	ItemListing,
	type ItemListingRepository,
	type ItemListingEntityReference,
	type ItemListingProps,
} from '@ocom/api-domain';
import {
	Title,
	Description,
	Category,
	Location,
	ListingState,
} from '@ocom/api-domain';

export class ItemListingRepositoryImpl<PassportType extends ItemListingProps>
	implements ItemListingRepository<PassportType>
{
	private readonly model: Model<any>;
	private readonly createPassport: () => PassportType;

	constructor(
		model: Model<any>,
		createPassport: () => PassportType,
	) {
		this.model = model;
		this.createPassport = createPassport;
	}

	async get(id: string): Promise<ItemListing<PassportType>> {
		const doc = await this.model.findById(id);
		if (!doc) {
			throw new Error(`ItemListing with id ${id} not found`);
		}
		return this.mapToEntity(doc);
	}

	async save(itemListing: ItemListing<PassportType>): Promise<ItemListing<PassportType>> {
		const doc = await this.model.findByIdAndUpdate(
			itemListing.id,
			{
				sharer: itemListing.sharer,
				title: itemListing.title.valueOf(),
				description: itemListing.description.valueOf(),
				category: itemListing.category.valueOf(),
				location: itemListing.location.valueOf(),
				sharingPeriodStart: itemListing.sharingPeriodStart,
				sharingPeriodEnd: itemListing.sharingPeriodEnd,
				state: itemListing.state.valueOf(),
				createdAt: itemListing.createdAt,
				updatedAt: itemListing.updatedAt,
				schemaversion: itemListing.schemaVersion,
				sharingHistory: itemListing.sharingHistory,
				reports: itemListing.reports,
				images: itemListing.images,
			},
			{ upsert: true, new: true }
		);

		return this.mapToEntity(doc);
	}

	async getById(id: string): Promise<ItemListing<PassportType> | undefined> {
		const doc = await this.model.findById(id);
		if (!doc) {
			return undefined;
		}
		return this.mapToEntity(doc);
	}

	async findActiveListings(options: {
		search?: string;
		category?: string;
		first?: number;
		after?: string;
	}): Promise<{
		edges: Array<{
			node: ItemListing<PassportType>;
			cursor: string;
		}>;
		pageInfo: {
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			startCursor?: string;
			endCursor?: string;
		};
		totalCount: number;
	}> {
		const limit = options.first || 20;
		let query: any = { state: 'Published' };

		// Add search filter
		if (options.search) {
			query.$or = [
				{ title: { $regex: options.search, $options: 'i' } },
				{ description: { $regex: options.search, $options: 'i' } }
			];
		}

		// Add category filter
		if (options.category && options.category !== 'All') {
			query.category = options.category;
		}

		// Handle cursor-based pagination
		if (options.after) {
			query._id = { $gt: options.after };
		}

		const docs = await this.model
			.find(query)
			.sort({ _id: 1 })
			.limit(limit + 1);

		const hasNextPage = docs.length > limit;
		const actualDocs = hasNextPage ? docs.slice(0, -1) : docs;

		const edges = actualDocs.map(doc => ({
			node: this.mapToEntity(doc),
			cursor: doc._id.toString(),
		}));

		const totalCount = await this.model.countDocuments({ state: 'Published' });

		return {
			edges,
			pageInfo: {
				hasNextPage,
				hasPreviousPage: !!options.after,
				startCursor: edges.length > 0 ? edges[0]?.cursor : undefined,
				endCursor: edges.length > 0 ? edges[edges.length - 1]?.cursor : undefined,
			},
			totalCount,
		};
	}

	async getBySharerID(sharerId: string): Promise<ItemListing<PassportType>[]> {
		const docs = await this.model.find({ sharer: sharerId });
		return docs.map(doc => this.mapToEntity(doc));
	}

	async saveAndGetReference(
		itemListing: ItemListing<PassportType>,
	): Promise<ItemListingEntityReference> {
		const doc = await this.model.findByIdAndUpdate(
			itemListing.id,
			{
				sharer: itemListing.sharer,
				title: itemListing.title.valueOf(),
				description: itemListing.description.valueOf(),
				category: itemListing.category.valueOf(),
				location: itemListing.location.valueOf(),
				sharingPeriodStart: itemListing.sharingPeriodStart,
				sharingPeriodEnd: itemListing.sharingPeriodEnd,
				state: itemListing.state.valueOf(),
				createdAt: itemListing.createdAt,
				updatedAt: itemListing.updatedAt,
				schemaversion: itemListing.schemaVersion,
				sharingHistory: itemListing.sharingHistory,
				reports: itemListing.reports,
				images: itemListing.images,
			},
			{ upsert: true, new: true }
		);

		return {
			id: doc._id.toString(),
		} as ItemListingEntityReference;
	}

	private mapToEntity(doc: any): ItemListing<PassportType> {
		const props = {
			id: doc._id.toString(),
			sharer: doc.sharer.toString(),
			title: new Title(doc.title),
			description: new Description(doc.description),
			category: new Category(doc.category),
			location: new Location(doc.location),
			sharingPeriodStart: doc.sharingPeriodStart,
			sharingPeriodEnd: doc.sharingPeriodEnd,
			state: new ListingState(doc.state),
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
			schemaVersion: doc.schemaversion,
			sharingHistory: doc.sharingHistory || [],
			reports: doc.reports || 0,
			images: doc.images || [],
		};

		const passport = { ...this.createPassport(), itemListing: doc.itemListing ?? undefined };
		return new ItemListing(props as PassportType, passport);
	}
}