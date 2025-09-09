import { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';


// Type aliases for model and adapter

type PropType = ReservationRequestDomainAdapter;
type ReservationRequestModelType = Models.ReservationRequest.ReservationRequest;
export class ReservationRequestRepository
	extends MongooseSeedwork.MongoRepositoryBase<
		ReservationRequestModelType,
		PropType,
		Domain.Passport,
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>
	>
	implements Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<PropType>
{
	async getById(id: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>> {
		const mongoReservation = await this.model
			.findById(id)
			.populate(['listing', 'reserver'])
			.exec();
		if (!mongoReservation) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoReservation, this.passport);
	}

	async getAll(): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find()
			.populate(['listing', 'reserver'])
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}
	async getByIdWithListing(
		id: string,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>> {
		const mongoReservation = await this.model
			.findById(id)
			.populate(['listing', 'reserver'])
			.exec();
		if (!mongoReservation) {
			throw new Error(`ReservationRequest with id ${id} not found`);
		}
		return this.typeConverter.toDomain(mongoReservation, this.passport);
	}

	getNewInstance(
		state: string,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
        reservationPeriodStart: Date,
        reservationPeriodEnd: Date,
	): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest.getNewInstance(
				adapter,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				this.passport,
			),
		);
	}

	async getByReserverId(reserverId: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ reserver: reserverId })
			.populate(['listing', 'reserver'])
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async getByListingId(listingId: string): Promise<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[]> {
		const mongoReservations = await this.model
			.find({ listing: listingId })
			.populate(['listing', 'reserver'])
			.exec();
		return mongoReservations.map(doc => this.typeConverter.toDomain(doc, this.passport));
	}

	async getByListingOwnerIDWithPagination(
		_ownerId: string,
		options: {
			page: number;
			pageSize: number;
			searchText?: string;
			statusFilters?: string[];
			sorter?: { field: string; order: 'ascend' | 'descend' };
		}
	): Promise<{
		items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<PropType>[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		// TODO: Replace with real MongoDB implementation
		// For now, using mock data to match the existing implementation pattern
		return Promise.resolve(this.getMockRequestsWithPagination(_ownerId, options));
	}

	private getMockRequestsWithPagination(
		_ownerId: string,
		options: {
			page: number;
			pageSize: number;
			searchText?: string;
			statusFilters?: string[];
			sorter?: { field: string; order: 'ascend' | 'descend' };
		}
	) {
		// Mock data for reservation requests
		const mockRequests = [
			{
				id: '6324a3f1e3e4e1e6a8e1d9b1',
				listingId: '6324a3f1e3e4e1e6a8e1d8b2',
				listing: {
					id: '6324a3f1e3e4e1e6a8e1d8b2',
					title: 'City Bike',
					image: '/assets/item-images/bike.png',
				},
				requestedBy: '@patrickg',
				requestedByUserId: 'patrick123',
				requestedOn: new Date('2025-12-23').toISOString(),
				reservationPeriod: '2020-11-08 - 2020-12-23',
				status: 'Pending',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d9b7',
				listingId: '6324a3f1e3e4e1e6a8e1d8b7',
				listing: {
					id: '6324a3f1e3e4e1e6a8e1d8b7',
					title: 'Electric Guitar',
					image: '/assets/item-images/projector.png',
				},
				requestedBy: '@musicfan',
				requestedByUserId: 'musicfan007',
				requestedOn: new Date('2025-09-02').toISOString(),
				reservationPeriod: '2025-09-05 - 2025-09-10',
				status: 'Accepted',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d9b8',
				listingId: '6324a3f1e3e4e1e6a8e1d8b8',
				listing: {
					id: '6324a3f1e3e4e1e6a8e1d8b8',
					title: 'Stand Mixer',
					image: '/assets/item-images/sewing-machine.png',
				},
				requestedBy: '@bakerella',
				requestedByUserId: 'bakequeen',
				requestedOn: new Date('2025-10-02').toISOString(),
				reservationPeriod: '2025-10-03 - 2025-10-07',
				status: 'Pending',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d9b9',
				listingId: '6324a3f1e3e4e1e6a8e1d8b9',
				listing: {
					id: '6324a3f1e3e4e1e6a8e1d8b9',
					title: 'Bubble Chair',
					image: '/assets/item-images/bubble-chair.png',
				},
				requestedBy: '@lounger',
				requestedByUserId: 'loungerx',
				requestedOn: new Date('2025-11-02').toISOString(),
				reservationPeriod: '2025-11-03 - 2025-11-10',
				status: 'Rejected',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d9c0',
				listingId: '6324a3f1e3e4e1e6a8e1d8c0',
				listing: {
					id: '6324a3f1e3e4e1e6a8e1d8c0',
					title: 'Projector',
					image: '/assets/item-images/projector.png',
				},
				requestedBy: '@movienight',
				requestedByUserId: 'movielover',
				requestedOn: new Date('2025-12-02').toISOString(),
				reservationPeriod: '2025-12-03 - 2025-12-05',
				status: 'Pending',
			},
		];

		let filteredRequests = mockRequests;

		// Apply search text filter
		if (options.searchText) {
			filteredRequests = filteredRequests.filter((request) =>
				request.listing.title
					.toLowerCase()
					.includes(options.searchText?.toLowerCase() || ''),
			);
		}

		// Apply status filters
		if (options.statusFilters && options.statusFilters.length > 0) {
			filteredRequests = filteredRequests.filter((request) =>
				options.statusFilters?.includes(request.status),
			);
		}

		// Apply sorter
		if (options.sorter?.field) {
			filteredRequests.sort((a, b) => {
				const fieldA =
					options.sorter?.field === 'title'
						? a.listing.title
						: a[options.sorter?.field as keyof typeof a];
				const fieldB =
					options.sorter?.field === 'title'
						? b.listing.title
						: b[options.sorter?.field as keyof typeof b];

				// Handle undefined cases for sorting
				if (fieldA === undefined || fieldA === null)
					return options.sorter?.order === 'ascend' ? -1 : 1;
				if (fieldB === undefined || fieldB === null)
					return options.sorter?.order === 'ascend' ? 1 : -1;

				if (fieldA < fieldB) {
					return options.sorter?.order === 'ascend' ? -1 : 1;
				}
				if (fieldA > fieldB) {
					return options.sorter?.order === 'ascend' ? 1 : -1;
				}
				return 0;
			});
		}

		const total = filteredRequests.length;
		const startIndex = (options.page - 1) * options.pageSize;
		const endIndex = startIndex + options.pageSize;
		const items = filteredRequests.slice(startIndex, endIndex);

		// Convert mock data to domain objects (simplified for now)
		const domainItems = items as any; // TODO: Properly convert to domain objects

		return {
			items: domainItems,
			total,
			page: options.page,
			pageSize: options.pageSize,
		};
	}
}