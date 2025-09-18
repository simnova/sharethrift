import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import {
	ItemListingDataSourceImpl,
	type ItemListingDataSource,
} from './item-listing.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ItemListingConverter } from '../../../domain/listing/item/item-listing.domain-adapter.ts';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
export interface ItemListingReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null>;
	getBySharer: (
		sharerId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	>;
}

export class ItemListingReadRepositoryImpl
	implements ItemListingReadRepository
{
	private readonly mongoDataSource: ItemListingDataSource;
	private readonly converter: ItemListingConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new ItemListingDataSourceImpl(
			models.Listing.ItemListingModel,
		);
		this.converter = new ItemListingConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null> {
		// const result = await this.mongoDataSource.findById(id, options);
		// if (!result) {
		// 	return null;
		// }
		// return this.converter.toDomain(result, this.passport);
        console.log(options); // To avoid unused variable error
        return await Promise.resolve({
            _id: new Types.ObjectId(),
            id: id,
            title: 'Professional Microphone',
            description: 'A high-quality microphone for professional use.',
            category: 'Electronics',
            location: 'New York, NY',
            sharingPeriodStart: new Date('2024-09-05T10:00:00Z'),
            sharingPeriodEnd: new Date('2024-09-15T10:00:00Z'),
            state: 'Published',
            schemaVersion: '1',
            createdAt: new Date('2024-01-05T09:00:00Z'),
            updatedAt: new Date('2024-01-13T09:00:00Z'),
            sharer: {
                _id: new Types.ObjectId(),
                id: '5f8d0d55b54764421b7156c5',
                userType: 'personal',
                isBlocked: false,
                account: {
                    accountType: 'personal',
                    email: 'sharer2@example.com',
                    username: 'shareruser2',
                    profile: {
                        firstName: 'Jane',
                        lastName: 'Reserver',
                        location: {
                            address1: '123 Main St',
                            city: 'Boston',
                            state: 'MA',
                            country: 'USA',
                            zipCode: '02101',
                        },
                        billing: {
                            subscriptionId: '98765789',
                            cybersourceCustomerId: '87654345678',
                        },
                    },
                },
                schemaVersion: '1',
                createdAt: new Date('2024-01-05T09:00:00Z'),
                updatedAt: new Date('2024-01-13T09:00:00Z'),
            },
        });
	}

	async getBySharer(
		sharerId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
		// Assuming the field is 'sharer' in the model and stores the user's ObjectId or externalId
		const result = await this.mongoDataSource.find(
			{ sharer: new ObjectId(sharerId) },
			options,
		);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}
}

export const getItemListingReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ItemListingReadRepositoryImpl(models, passport);
};
