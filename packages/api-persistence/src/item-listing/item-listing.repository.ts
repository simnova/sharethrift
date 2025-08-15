import type { Domain } from '@sthrift/api-domain';
import type { ItemListingModels } from '@sthrift/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { ItemListingDomainAdapter } from './item-listing.domain-adapter.ts';

// Type aliases for model and adapter
type PropType = ItemListingDomainAdapter;
type ItemListingModelType = ItemListingModels.ItemListingDocument;

export class ItemListingRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ItemListingModelType,
		PropType,
		Domain.Contexts.Passport,
		Domain.Contexts.ItemListing<PropType>
	>
	implements Domain.Contexts.ItemListingRepository<PropType>
{
	async getById(id: string): Promise<Domain.Contexts.ItemListing<PropType>> {
		const mongoItem = await this.model.findById(id).exec();
		if (!mongoItem) {
			throw new Error(`ItemListing with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoItem, this.passport);
	}

	async getAll(): Promise<Domain.Contexts.ItemListing<PropType>[]> {
		const mongoItems = await this.model.find().exec();
		return mongoItems.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async saveAndGetReference(itemListing: Domain.Contexts.ItemListing<PropType>): Promise<Domain.Contexts.ItemListingEntityReference> {
		await this.save(itemListing);
		return itemListing.getEntityReference();
	}

	async findActiveListings(): Promise<Domain.Contexts.ItemListing<PropType>[]> {
		const mongoItems = await this.model.find({ isActive: true }).exec();
		return mongoItems.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async getBySharerID(sharerID: string): Promise<Domain.Contexts.ItemListing<PropType>[]> {
		const mongoItems = await this.model.find({ sharer: sharerID }).exec();
		return mongoItems.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}
}
