import type { Domain } from '@sthrift/api-domain';
import { Types } from 'mongoose';
import type { ModelsContext } from '../../../../index.ts';
import {
	ReservationRequestDataSourceImpl,
	type ReservationRequestDataSource,
} from './reservation-request.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export interface ReservationRequestReadRepository {
	getAll: (
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getById: (
		id: string,
		options?: FindOneOptions,
	) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
	getByReserverId: (
		reserverId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getActiveByReserverIdWithListingWithSharer: (
		reserverId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
    getPastByReserverIdWithListingWithSharer: (
		reserverId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
    getActiveByReserverIdAndListingId: (
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null
	>;
}

export class ReservationRequestReadRepositoryImpl
	implements ReservationRequestReadRepository
{
	private readonly mongoDataSource: ReservationRequestDataSource;
	private readonly converter: ReservationRequestConverter;
	private readonly passport: Domain.Passport;

	/**
	 * Constructs a new ReservationRequestReadRepositoryImpl.
	 * @param models - The models context containing the ReservationRequest model.
	 * @param passport - The passport object for domain access.
	 */
	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new ReservationRequestDataSourceImpl(
			models.ReservationRequest.ReservationRequest,
		);
		this.converter = new ReservationRequestConverter();
		this.passport = passport;
	}

	/**
	 * Retrieves all ReservationRequest entities.
	 * @param options - Optional find options for querying.
	 * @returns A promise that resolves to an array of ReservationRequestEntityReference objects.
	 */
	async getAll(
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	/**
	 * Retrieves a ReservationRequest entity by its ID.
	 * @param id - The ID of the ReservationRequest entity.
	 * @param options - Optional find options for querying.
	 * @returns A promise that resolves to a ReservationRequestEntityReference object or null if not found.
	 */
	async getById(
		id: string,
		options?: FindOneOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
		const result = await this.mongoDataSource.findById(id, options);
		if (!result) {
			return null;
		}
		return this.converter.toDomain(result, this.passport);
	}

	/**
	 * Retrieves all ReservationRequest entities for which the specified user is a reserver.
	 */
	async getByReserverId(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter = {
			reserver: new Types.ObjectId(reserverId)
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

    /**
     * Retrieves an array of active ReservationRequest entities by the id of its reserver field, including the 'listing' and 'listing.sharer' fields.
     * @param reserverId - The ID of the Reserver entity on the ReservationRequest.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to an array of ReservationRequestEntityReference objects or null if not found.
     */
	async getActiveByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
        // Real implementation, commented out for the time being
        // const filter = {
		// 	reserver: new MongooseSeedwork.ObjectId(reserverId),
		// 	state: { $in: ['Accepted', 'Requested'] },
		// };
		// const result = await this.mongoDataSource.find(filter, { ...options, populateFields: ['listing', 'listing.sharer'] });
		// return result.map((doc) => this.converter.toDomain(doc, this.passport));

		// Mock result for active reservations, uses await to avoid error
		const mockResult = await Promise.resolve(
			getMockReservationRequests(reserverId, 'active'),
		);
		console.log(options); //gets rid of unused error
		return Promise.resolve(mockResult);
	}

    /**
     * Retrieves an array of past ReservationRequest entities by the id of its reserver field, including the 'listing' and 'listing.sharer' fields.
     * @param reserverId - The ID of the Reserver entity on the ReservationRequest.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to an array of ReservationRequestEntityReference objects or null if not found.
     */
	async getPastByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
        // Real implementation, commented out for the time being
        // const filter = {
		// 	reserver: new MongooseSeedwork.ObjectId(reserverId),
		// 	state: { $in: ['Cancelled', 'Closed', 'Rejected'] },
		// };
		// const result = await this.mongoDataSource.find(filter, { ...options, populateFields: ['listing', 'listing.sharer'] });
		// return result.map((doc) => this.converter.toDomain(doc, this.passport));
        
		// Mock result for past reservations, uses await to avoid error
		const mockResult = await Promise.resolve(
			getMockReservationRequests(reserverId, 'past'),
		);
		console.log(options); //gets rid of unused error
		return Promise.resolve(mockResult);
	}

    async getActiveByReserverIdAndListingId(
        reserverId: string,
        listingId: string,
        options?: FindOptions,
    ): Promise<
        Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null
    > {
        const filter = {
        	reserver: new MongooseSeedwork.ObjectId(reserverId),
        	listing: new MongooseSeedwork.ObjectId(listingId),
        	state: { $in: ['Accepted', 'Requested'] },
        };
        const result = await this.mongoDataSource.findOne(filter, options);
        if (!result) {
            return null;
        }
        return this.converter.toDomain(result, this.passport);
    }
}

export const getReservationRequestReadRepository = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return new ReservationRequestReadRepositoryImpl(models, passport);
};

const getMockReservationRequests = (
	reserverId: string,
	type: string,
): Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[] => {
	const reservationState = type === 'active' ? 'Accepted' : 'Closed';
	const mockResult = [
		{
			_id: new Types.ObjectId(),
			id: '507f1f77bcf86cd799439011',
			state: reservationState,
			reservationPeriodStart: new Date('2024-09-05T10:00:00Z'),
			reservationPeriodEnd: new Date('2024-09-15T10:00:00Z'),
			createdAt: new Date('2024-09-01T10:00:00Z'),
			updatedAt: new Date('2024-09-05T12:00:00Z'),
			schemaVersion: '1',
			listing: {
				_id: new Types.ObjectId(),
				id: '60ddc9732f8fb814c89b6789',
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
			},
			reserver: {
				_id: new Types.ObjectId(reserverId),
				id: reserverId,
				name: 'John Doe',
				account: {
					accountType: 'personal',
					email: 'reserver@example.com',
					username: 'reserveruser',
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
				userType: 'personal',
				isBlocked: false,
				schemaVersion: '1',
				createdAt: new Date('2024-01-01T09:00:00Z'),
				updatedAt: new Date('2024-01-13T09:00:00Z'),
			},
			closeRequestedBySharer: false,
			closeRequestedByReserver: false,
			loadListing: () => {
				return Promise.resolve({
					_id: new Types.ObjectId(),
					id: '60ddc9732f8fb814c89b6789',
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
						id: 'mock-sharer-id',
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
			},
			loadReserver: () => {
				return Promise.resolve({
					_id: new Types.ObjectId(reserverId),
					id: reserverId,
					name: 'John Doe',
					account: {
						accountType: 'personal',
						email: 'reserver@example.com',
						username: 'reserveruser',
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
					createdAt: new Date('2024-01-01T09:00:00Z'),
					updatedAt: new Date('2024-01-13T09:00:00Z'),
					userType: 'personal',
					isBlocked: false,
				});
			},
		},
	];
	return mockResult;
};
