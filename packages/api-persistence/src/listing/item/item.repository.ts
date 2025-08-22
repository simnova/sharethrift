import type { Domain } from '@sthrift/api-domain';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import type { ItemListingDomainAdapter } from './item.domain-adapter.ts';
import { MockReservationRequestService } from './mock-reservation-request.service.ts';

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
	private mockRequestService: MockReservationRequestService;

	constructor(
		passport: Domain.Contexts.Passport,
		model: Models.Listing.ItemListingModelType,
		converter: { toDomain: (doc: ItemListingModelType, passport: Domain.Contexts.Passport) => Domain.Contexts.ItemListing<PropType> }
	) {
		this.passport = passport;
		this.model = model;
		this.converter = converter;
		this.mockRequestService = new MockReservationRequestService();
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

	async findBySharerWithPagination(options: {
		sharerId: string;
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilter?: string[];
		sortBy?: string;
		sortOrder?: 'asc' | 'desc';
	}): Promise<{
		edges: Array<{
			node: Domain.Contexts.ItemListing<PropType>;
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
		// Build query filter
		const query: Record<string, unknown> = { sharer: options.sharerId };
		
		// Add text search filter
		if (options.searchText) {
			query['$or'] = [
				{ title: { $regex: options.searchText, $options: 'i' } },
				{ description: { $regex: options.searchText, $options: 'i' } }
			];
		}
		
		// Add status filter
		if (options.statusFilter && options.statusFilter.length > 0) {
			// Map frontend status names to backend state names
			const statusMap: { [key: string]: string } = {
				'Active': 'Published',
				'Paused': 'Paused',
				'Reserved': 'Published', // Reserved is a computed state
				'Expired': 'Expired',
				'Draft': 'Drafted',
				'Blocked': 'Blocked'
			};
			
			const mappedStatuses = options.statusFilter.map(status => statusMap[status] || status);
			query['state'] = { $in: mappedStatuses };
		}
		
		// Build sort options  
		let sortOption: { [key: string]: 1 | -1 };
		if (options.sortBy) {
			const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
			switch (options.sortBy) {
				case 'title':
					sortOption = { title: sortOrder };
					break;
				case 'publishedAt':
					sortOption = { createdAt: sortOrder };
					break;
				case 'reservationPeriod':
					sortOption = { sharingPeriodStart: sortOrder };
					break;
				case 'pendingRequestsCount':
					// For now, we'll sort by creation date since we can't easily sort by request count
					// In the future, this could use aggregation pipeline
					sortOption = { createdAt: sortOrder };
					break;
				default:
					sortOption = { createdAt: -1 };
			}
		} else {
			sortOption = { createdAt: -1 }; // Default sort
		}
		
		// Calculate pagination
		const skip = (options.page - 1) * options.pageSize;
		const limit = options.pageSize;
		
		// Execute queries
		const [mongoItems, totalCount] = await Promise.all([
			this.model.find(query).sort(sortOption).skip(skip).limit(limit).exec(),
			this.model.countDocuments(query).exec()
		]);
		
		// Convert to domain objects and add pending request counts
		const edges = mongoItems.map(doc => {
			const domainItem = this.converter.toDomain(doc, this.passport);
			
			// Add pending request count using mock service
			const pendingRequestCount = this.mockRequestService.getRequestCountByStatus(String(doc._id), 'Pending');
			
			// Extend the domain item with computed properties
			const extendedItem = Object.assign(domainItem, { 
				pendingRequestsCount: pendingRequestCount,
				// Add other computed properties like actual reservation status
				isReserved: pendingRequestCount > 0 || this.mockRequestService.getRequestCountByStatus(String(doc._id), 'Accepted') > 0
			});
			
			return {
				node: extendedItem,
				cursor: String(doc._id)
			};
		});
		
		// Calculate pagination info
		const hasNextPage = skip + limit < totalCount;
		const hasPreviousPage = options.page > 1;
		
		const lastEdge = edges[edges.length - 1];
		return {
			edges,
			pageInfo: {
				hasNextPage,
				hasPreviousPage,
				...(edges.length > 0 && edges[0] && { startCursor: edges[0].cursor }),
				...(edges.length > 0 && lastEdge && { endCursor: lastEdge.cursor }),
			},
			totalCount
		};
	}

	async findBySharerWithRequestsWithPagination(options: {
		sharerId: string;
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilter?: string[];
		sortBy?: string;
		sortOrder?: 'asc' | 'desc';
	}): Promise<{
		edges: Array<{
			node: Domain.Contexts.ItemListing<PropType> & { requestData?: unknown };
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
		// First get all listings by the sharer
		const allListings = await this.model.find({ sharer: options.sharerId }).exec();
		const listingIds = allListings.map(doc => String(doc._id));
		
		// Get requests for these listings using mock service
		const requestsParams = {
			listingIds,
			page: options.page,
			pageSize: options.pageSize,
			...(options.searchText && { searchText: options.searchText }),
			...(options.statusFilter && { statusFilter: options.statusFilter }),
			...(options.sortBy && { sortBy: options.sortBy }),
			...(options.sortOrder && { sortOrder: options.sortOrder })
		};
		
		const requestsResult = this.mockRequestService.getRequestsWithPagination(requestsParams);
		
		// Get the listings that have requests
		const listingsWithRequests = new Map<string, { listing: ItemListingModelType; requests: unknown[] }>();
		for (const request of requestsResult.items) {
			const listing = allListings.find(doc => String(doc._id) === request.listing);
			if (listing) {
				if (!listingsWithRequests.has(request.listing)) {
					listingsWithRequests.set(request.listing, {
						listing,
						requests: []
					});
				}
				const existingData = listingsWithRequests.get(request.listing);
				if (existingData) {
					existingData.requests.push(request);
				}
			}
		}
		
		// Convert to domain objects with request data
		const edges: Array<{
			node: Domain.Contexts.ItemListing<PropType> & { requestData?: unknown };
			cursor: string;
		}> = [];
		
		for (const request of requestsResult.items) {
			const listingData = listingsWithRequests.get(request.listing);
			if (listingData) {
				const domainItem = this.converter.toDomain(listingData.listing, this.passport);
				
				const requestData = {
					id: request._id,
					requestedBy: request.reserver,
					requestedOn: request.createdAt,
					status: request.state,
					reservationPeriod: {
						start: request.reservationPeriodStart,
						end: request.reservationPeriodEnd
					}
				};
				
				edges.push({
					node: Object.assign(domainItem, { requestData }),
					cursor: request._id
				});
			}
		}
		
		// Calculate pagination info
		const hasNextPage = (options.page * options.pageSize) < requestsResult.totalCount;
		const hasPreviousPage = options.page > 1;
		
		const lastEdge = edges[edges.length - 1];
		return {
			edges,
			pageInfo: {
				hasNextPage,
				hasPreviousPage,
				...(edges.length > 0 && edges[0] && { startCursor: edges[0].cursor }),
				...(edges.length > 0 && lastEdge && { endCursor: lastEdge.cursor }),
			},
			totalCount: requestsResult.totalCount
		};
	}
}