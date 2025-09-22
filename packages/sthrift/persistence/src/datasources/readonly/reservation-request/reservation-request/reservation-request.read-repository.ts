import type { Domain } from '@sthrift/domain';
import { Types } from 'mongoose';
import type { ModelsContext } from '../../../../models-context.ts';
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
	// Returns reservation requests for listings owned by the sharer (listing owner dashboard)
	getListingRequestsBySharerId: (
		sharerId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getActiveByReserverIdAndListingId: (
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	) => Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null>;
	getOverlapActiveReservationRequestsForListing: (
		listingId: string,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
	getActiveByListingId: (
		listingId: string,
		options?: FindOptions,
	) => Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	>;
}

// Mock data for reservation requests targeting listings owned by a sharer
// (used by GraphQL myListingsRequests resolver until real query implemented)
const getMockListingReservationRequests = (
	sharerId: string,
): Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[] => {
	// Reuse base mock and tweak reserver / listing ids for variety
	const base = getMockReservationRequests('507f1f77bcf86cd799439099', 'active');
	return base.map((r, idx) => ({
		...r,
		id: `${r.id}-L${idx}`,
		listing: {
			...r.listing,
			sharer: {
				...r.listing.sharer,
				id: sharerId,
			},
		},
	}));
};

export class ReservationRequestReadRepositoryImpl
	implements ReservationRequestReadRepository
{
	private readonly mongoDataSource: ReservationRequestDataSource;
	private readonly converter: ReservationRequestConverter;
	private readonly passport: Domain.Passport;

	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.mongoDataSource = new ReservationRequestDataSourceImpl(
			models.ReservationRequest.ReservationRequest,
		);
		this.converter = new ReservationRequestConverter();
		this.passport = passport;
	}

	async getAll(
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const result = await this.mongoDataSource.find({}, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

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

	async getByReserverId(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter = {
			reserver: new Types.ObjectId(reserverId),
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const mockResult = await Promise.resolve(
			getMockReservationRequests(reserverId, 'active'),
		);
		console.log(options); //gets rid of unused error
		return Promise.resolve(mockResult);
	}

	async getPastByReserverIdWithListingWithSharer(
		reserverId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const mockResult = await Promise.resolve(
			getMockReservationRequests(reserverId, 'past'),
		);
		console.log(options); //gets rid of unused error
		return Promise.resolve(mockResult);
	}

	async getListingRequestsBySharerId(
		sharerId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		// For now reuse mock generator using sharerId to seed distinct ids
		const mockResult = await Promise.resolve(
			getMockListingReservationRequests(sharerId),
		);
		console.log(options); // silence unused
		return Promise.resolve(mockResult);
	}

	async getActiveByReserverIdAndListingId(
		reserverId: string,
		listingId: string,
		options?: FindOptions,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference | null> {
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

	async getOverlapActiveReservationRequestsForListing(
		listingId: string,
		reservationPeriodStart: Date,
		reservationPeriodEnd: Date,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		const filter = {
			listing: new MongooseSeedwork.ObjectId(listingId),
			state: { $in: ['Accepted', 'Requested'] },
			reservationPeriodStart: { $lt: reservationPeriodEnd },
			reservationPeriodEnd: { $gt: reservationPeriodStart },
		};
		const result = await this.mongoDataSource.find(filter, options);
		return result.map((doc) => this.converter.toDomain(doc, this.passport));
	}

	async getActiveByListingId(
		listingId: string,
		options?: FindOptions,
	): Promise<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
	> {
		// const filter = {
		//     listing: new MongooseSeedwork.ObjectId(listingId),
		// };
		// const result = await this.mongoDataSource.find(filter, options);
		// return result.map((doc) => this.converter.toDomain(doc, this.passport));
		const mockResult = await Promise.resolve(
			getMockReservationRequests('507f1f77bcf86cd799439011', 'active'),
		);
		console.log(options, listingId); //gets rid of unused error
		return Promise.resolve(mockResult);
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
	return [
		{
			id: '507f1f77bcf86cd799439011',
			state: reservationState,
			reservationPeriodStart: new Date('2025-10-27T10:00:00Z'),
			reservationPeriodEnd: new Date('2025-11-06T10:00:00Z'),
			createdAt: new Date('2024-09-01T10:00:00Z'),
			updatedAt: new Date('2024-09-05T12:00:00Z'),
			schemaVersion: '1',
			listing: {
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
								address2: null,
								city: 'Boston',
								state: 'MA',
								country: 'USA',
								zipCode: '02101',
							},
							billing: {
								subscriptionId: '98765789',
								cybersourceCustomerId: '87654345678',
								paymentState: 'active',
								lastTransactionId: 'txn-123456',
								lastPaymentAmount: 100.0,
							},
						},
					},
					schemaVersion: '1',
					createdAt: new Date('2024-01-05T09:00:00Z'),
					updatedAt: new Date('2024-01-13T09:00:00Z'),
					hasCompletedOnboarding: true,
					role: {
						id: 'role-id',
						roleName: 'user',
						isDefault: true,
						roleType: 'personal',
						createdAt: new Date('2024-01-01T09:00:00Z'),
						updatedAt: new Date('2024-01-13T09:00:00Z'),
						schemaVersion: '1',
						permissions: {
							listingPermissions: {
								canCreateItemListing: true,
								canUpdateItemListing: true,
								canDeleteItemListing: true,
								canViewItemListing: true,
								canPublishItemListing: true,
								canUnpublishItemListing: true,
							},
							conversationPermissions: {
								canCreateConversation: true,
								canManageConversation: true,
								canViewConversation: true,
							},
							reservationRequestPermissions: {
								canCreateReservationRequest: true,
								canManageReservationRequest: true,
								canViewReservationRequest: true,
							},
						},
					},
					loadRole: () =>
						Promise.resolve({
							id: 'role-id',
							roleName: 'user',
							isDefault: true,
							roleType: 'personal',
							createdAt: new Date('2024-01-01T09:00:00Z'),
							updatedAt: new Date('2024-01-13T09:00:00Z'),
							schemaVersion: '1',
							permissions: {
								listingPermissions: {
									canCreateItemListing: true,
									canUpdateItemListing: true,
									canDeleteItemListing: true,
									canViewItemListing: true,
									canPublishItemListing: true,
									canUnpublishItemListing: true,
								},
								conversationPermissions: {
									canCreateConversation: true,
									canManageConversation: true,
									canViewConversation: true,
								},
								reservationRequestPermissions: {
									canCreateReservationRequest: true,
									canManageReservationRequest: true,
									canViewReservationRequest: true,
								},
							},
						}),
				},
			},
			reserver: {
				id: reserverId,
				account: {
					accountType: 'personal',
					email: 'reserver@example.com',
					username: 'reserveruser',
					profile: {
						firstName: 'Jane',
						lastName: 'Reserver',
						location: {
							address1: '123 Main St',
							address2: null,
							city: 'Boston',
							state: 'MA',
							country: 'USA',
							zipCode: '02101',
						},
						billing: {
							subscriptionId: '98765789',
							cybersourceCustomerId: '87654345678',
							paymentState: 'active',
							lastTransactionId: 'txn-123456',
							lastPaymentAmount: 100.0,
						},
					},
				},
				userType: 'personal',
				isBlocked: false,
				schemaVersion: '1',
				createdAt: new Date('2024-01-01T09:00:00Z'),
				updatedAt: new Date('2024-01-13T09:00:00Z'),
				hasCompletedOnboarding: true,
				role: {
					id: 'role-id',
					roleName: 'user',
					isDefault: true,
					roleType: 'personal',
					createdAt: new Date('2024-01-01T09:00:00Z'),
					updatedAt: new Date('2024-01-13T09:00:00Z'),
					schemaVersion: '1',
					permissions: {
						listingPermissions: {
							canCreateItemListing: true,
							canUpdateItemListing: true,
							canDeleteItemListing: true,
							canViewItemListing: true,
							canPublishItemListing: true,
							canUnpublishItemListing: true,
						},
						conversationPermissions: {
							canCreateConversation: true,
							canManageConversation: true,
							canViewConversation: true,
						},
						reservationRequestPermissions: {
							canCreateReservationRequest: true,
							canManageReservationRequest: true,
							canViewReservationRequest: true,
						},
					},
				},
				loadRole: () =>
					Promise.resolve({
						id: 'role-id',
						roleName: 'user',
						isDefault: true,
						roleType: 'personal',
						createdAt: new Date('2024-01-01T09:00:00Z'),
						updatedAt: new Date('2024-01-13T09:00:00Z'),
						schemaVersion: '1',
						permissions: {
							listingPermissions: {
								canCreateItemListing: true,
								canUpdateItemListing: true,
								canDeleteItemListing: true,
								canViewItemListing: true,
								canPublishItemListing: true,
								canUnpublishItemListing: true,
							},
							conversationPermissions: {
								canCreateConversation: true,
								canManageConversation: true,
								canViewConversation: true,
							},
							reservationRequestPermissions: {
								canCreateReservationRequest: true,
								canManageReservationRequest: true,
								canViewReservationRequest: true,
							},
						},
					}),
			},
			closeRequestedBySharer: false,
			closeRequestedByReserver: false,
			loadListing: () => {
				return Promise.resolve({
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
									address2: null,
									city: 'Boston',
									state: 'MA',
									country: 'USA',
									zipCode: '02101',
								},
								billing: {
									subscriptionId: '98765789',
									cybersourceCustomerId: '87654345678',
									paymentState: 'active',
									lastTransactionId: 'txn-123456',
									lastPaymentAmount: 100.0,
								},
							},
						},
						schemaVersion: '1',
						createdAt: new Date('2024-01-05T09:00:00Z'),
						updatedAt: new Date('2024-01-13T09:00:00Z'),
						hasCompletedOnboarding: true,
						role: {
							id: 'role-id',
							roleName: 'user',
							isDefault: true,
							roleType: 'personal',
							createdAt: new Date('2024-01-01T09:00:00Z'),
							updatedAt: new Date('2024-01-13T09:00:00Z'),
							schemaVersion: '1',
							permissions: {
								listingPermissions: {
									canCreateItemListing: true,
									canUpdateItemListing: true,
									canDeleteItemListing: true,
									canViewItemListing: true,
									canPublishItemListing: true,
									canUnpublishItemListing: true,
								},
								conversationPermissions: {
									canCreateConversation: true,
									canManageConversation: true,
									canViewConversation: true,
								},
								reservationRequestPermissions: {
									canCreateReservationRequest: true,
									canManageReservationRequest: true,
									canViewReservationRequest: true,
								},
							},
						},
						loadRole: () =>
							Promise.resolve({
								id: 'role-id',
								roleName: 'user',
								isDefault: true,
								roleType: 'personal',
								createdAt: new Date('2024-01-01T09:00:00Z'),
								updatedAt: new Date('2024-01-13T09:00:00Z'),
								schemaVersion: '1',
								permissions: {
									listingPermissions: {
										canCreateItemListing: true,
										canUpdateItemListing: true,
										canDeleteItemListing: true,
										canViewItemListing: true,
										canPublishItemListing: true,
										canUnpublishItemListing: true,
									},
									conversationPermissions: {
										canCreateConversation: true,
										canManageConversation: true,
										canViewConversation: true,
									},
									reservationRequestPermissions: {
										canCreateReservationRequest: true,
										canManageReservationRequest: true,
										canViewReservationRequest: true,
									},
								},
							}),
					},
				});
			},
			loadReserver: () => {
				const mockRole = {
					id: 'role-id',
					roleName: 'user',
					isDefault: true,
					roleType: 'personal',
					createdAt: new Date('2024-01-01T09:00:00Z'),
					updatedAt: new Date('2024-01-13T09:00:00Z'),
					schemaVersion: '1',
					permissions: {
						listingPermissions: {
							canCreateItemListing: true,
							canUpdateItemListing: true,
							canDeleteItemListing: true,
							canViewItemListing: true,
							canPublishItemListing: true,
							canUnpublishItemListing: true,
						},
						conversationPermissions: {
							canCreateConversation: true,
							canManageConversation: true,
							canViewConversation: true,
						},
						reservationRequestPermissions: {
							canCreateReservationRequest: true,
							canManageReservationRequest: true,
							canViewReservationRequest: true,
						},
					},
				};
				return Promise.resolve({
					id: reserverId,
					//name: 'John Doe',
					account: {
						accountType: 'personal',
						email: 'reserver@example.com',
						username: 'reserveruser',
						profile: {
							firstName: 'Jane',
							lastName: 'Reserver',
							location: {
								address1: '123 Main St',
								address2: null,
								city: 'Boston',
								state: 'MA',
								country: 'USA',
								zipCode: '02101',
							},
							billing: {
								subscriptionId: '98765789',
								cybersourceCustomerId: '87654345678',
								paymentState: 'active',
								lastTransactionId: 'txn-123456',
								lastPaymentAmount: 100.0,
							},
						},
					},
					schemaVersion: '1',
					createdAt: new Date('2024-01-01T09:00:00Z'),
					updatedAt: new Date('2024-01-13T09:00:00Z'),
					userType: 'personal',
					isBlocked: false,
					hasCompletedOnboarding: true,
					role: mockRole,
					loadRole: () => Promise.resolve(mockRole),
				});
			},
		},
	];
};
