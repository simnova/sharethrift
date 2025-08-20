import type { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import type { ItemListingDomainAdapter } from './item.domain-adapter.ts';

// Type aliases for model and adapter
type PropType = ItemListingDomainAdapter;
type ItemListingModelType = Models.Listing.ItemListing;

/**
 * Simplified repository implementation
 */
export class ItemListingRepository implements Domain.Contexts.ItemListingRepository<PropType> {
	private model: Models.Listing.ItemListingModelType;
	private converter: { toDomain: (doc: ItemListingModelType, passport: Domain.Contexts.Passport) => Domain.Contexts.ItemListing<PropType> };
	private passport: Domain.Contexts.Passport;

	constructor(
		passport: Domain.Contexts.Passport,
		model: Models.Listing.ItemListingModelType,
		converter: { toDomain: (doc: ItemListingModelType, passport: Domain.Contexts.Passport) => Domain.Contexts.ItemListing<PropType> }
	) {
		this.passport = passport;
		this.model = model;
		this.converter = converter;
	}

	async get(id: string): Promise<Domain.Contexts.ItemListing<PropType>> {
		const mongoItem = await this.model.findById(id).exec();
		if (!mongoItem) {
			throw new Error(`ItemListing with id ${id} not found`);
		}
		return this.converter.toDomain(mongoItem, this.passport);
	}

	async getById(id: string): Promise<Domain.Contexts.ItemListing<PropType> | undefined> {
		const mongoItem = await this.model.findById(id).exec();
		if (!mongoItem) {
			return undefined;
		}
		return this.converter.toDomain(mongoItem, this.passport);
	}

	save(itemListing: Domain.Contexts.ItemListing<PropType>): Promise<Domain.Contexts.ItemListing<PropType>> {
		// Simple implementation - in production this would handle save logic properly
		return Promise.resolve(itemListing);
	}

	async saveAndGetReference(itemListing: Domain.Contexts.ItemListing<PropType>): Promise<Domain.Contexts.ItemListingEntityReference> {
		await this.save(itemListing);
		return itemListing.getEntityReference();
	}

	async findActiveListings(_options: { search?: string; category?: string; first?: number; after?: string; }): Promise<{
		edges: { node: Domain.Contexts.ItemListing<PropType>; cursor: string }[];
		pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string; endCursor?: string };
		totalCount: number;
	}> {
		const mongoItems = await this.model.find({ state: 'Published' }).exec();
		return {
			edges: mongoItems.map(doc => ({
				node: this.converter.toDomain(doc, this.passport),
				cursor: String(doc._id),
			})),
			pageInfo: {
				hasNextPage: false, // Implement pagination logic
				hasPreviousPage: false, // Implement pagination logic
			},
			totalCount: mongoItems.length,
		};
	}

	async getBySharerID(sharerID: string): Promise<Domain.Contexts.ItemListing<PropType>[]> {
		const mongoItems = await this.model.find({ sharer: sharerID }).exec();
		return mongoItems.map(doc => this.converter.toDomain(doc, this.passport));
	}
}