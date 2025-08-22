/**
 * Mock service for ReservationRequest data until the domain is implemented
 * This mimics the structure mentioned: _id, state, reservationPeriodStart, reservationPeriodEnd, 
 * createdAt, listing (ID reference), reserver, updatedAt, schemaVersion, closeRequested
 */

export interface MockReservationRequest {
	_id: string;
	state: 'Pending' | 'Accepted' | 'Rejected' | 'Closed' | 'Closing';
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	createdAt: Date;
	listing: string; // ObjectId reference to listing
	reserver: string; // User who made the request
	updatedAt: Date;
	schemaVersion: number;
	closeRequested: boolean;
}

export class MockReservationRequestService {
	private mockRequests: MockReservationRequest[] = [
		{
			_id: '64a7b8c9d1e2f3a4b5c6d7e8',
			state: 'Pending',
			reservationPeriodStart: new Date('2024-11-08'),
			reservationPeriodEnd: new Date('2024-12-23'),
			createdAt: new Date('2024-12-23'),
			listing: 'mockListingId1',
			reserver: '@patrickg',
			updatedAt: new Date('2024-12-23'),
			schemaVersion: 1,
			closeRequested: false
		},
		{
			_id: '64a7b8c9d1e2f3a4b5c6d7e9',
			state: 'Accepted',
			reservationPeriodStart: new Date('2024-11-08'),
			reservationPeriodEnd: new Date('2024-12-23'),
			createdAt: new Date('2024-01-03'),
			listing: 'mockListingId2',
			reserver: '@jasonm',
			updatedAt: new Date('2024-01-03'),
			schemaVersion: 1,
			closeRequested: false
		},
		{
			_id: '64a7b8c9d1e2f3a4b5c6d7ea',
			state: 'Rejected',
			reservationPeriodStart: new Date('2024-11-08'),
			reservationPeriodEnd: new Date('2024-12-23'),
			createdAt: new Date('2024-01-12'),
			listing: 'mockListingId3',
			reserver: '@shannonj',
			updatedAt: new Date('2024-01-12'),
			schemaVersion: 1,
			closeRequested: false
		},
		{
			_id: '64a7b8c9d1e2f3a4b5c6d7eb',
			state: 'Closed',
			reservationPeriodStart: new Date('2024-11-08'),
			reservationPeriodEnd: new Date('2024-12-23'),
			createdAt: new Date('2024-04-02'),
			listing: 'mockListingId4',
			reserver: '@patrickg',
			updatedAt: new Date('2024-04-02'),
			schemaVersion: 1,
			closeRequested: false
		},
		{
			_id: '64a7b8c9d1e2f3a4b5c6d7ec',
			state: 'Closing',
			reservationPeriodStart: new Date('2024-11-08'),
			reservationPeriodEnd: new Date('2024-12-23'),
			createdAt: new Date('2024-02-22'),
			listing: 'mockListingId5',
			reserver: '@jasonm',
			updatedAt: new Date('2024-02-22'),
			schemaVersion: 1,
			closeRequested: true
		}
	];

	/**
	 * Get requests for a specific listing
	 */
	getRequestsByListingId(listingId: string): MockReservationRequest[] {
		return this.mockRequests.filter(req => req.listing === listingId);
	}

	/**
	 * Get count of requests by status for a specific listing
	 */
	getRequestCountByStatus(listingId: string, status?: string): number {
		const requests = this.getRequestsByListingId(listingId);
		if (status) {
			return requests.filter(req => req.state === status).length;
		}
		return requests.length;
	}

	/**
	 * Get all requests for listings owned by a specific sharer
	 */
	getRequestsForSharerListings(listingIds: string[]): MockReservationRequest[] {
		return this.mockRequests.filter(req => listingIds.includes(req.listing));
	}

	/**
	 * Get paginated requests with filtering and sorting
	 */
	getRequestsWithPagination(options: {
		listingIds: string[];
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilter?: string[];
		sortBy?: string;
		sortOrder?: 'asc' | 'desc';
	}): {
		items: MockReservationRequest[];
		totalCount: number;
	} {
		let filteredRequests = this.getRequestsForSharerListings(options.listingIds);

		// Apply text search filter (search by reserver name)
		if (options.searchText) {
			const searchText = options.searchText;
			filteredRequests = filteredRequests.filter(req =>
				req.reserver.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		// Apply status filter
		if (options.statusFilter && options.statusFilter.length > 0) {
			const statusFilter = options.statusFilter;
			filteredRequests = filteredRequests.filter(req =>
				statusFilter.includes(req.state)
			);
		}

		// Apply sorting
		if (options.sortBy) {
			const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
			const sortBy = options.sortBy;
			filteredRequests.sort((a, b) => {
				let aValue: string | Date, bValue: string | Date;
				switch (sortBy) {
					case 'requestedBy':
						aValue = a.reserver;
						bValue = b.reserver;
						break;
					case 'requestedOn':
						aValue = a.createdAt;
						bValue = b.createdAt;
						break;
					case 'reservationPeriod':
						aValue = a.reservationPeriodStart;
						bValue = b.reservationPeriodStart;
						break;
					default:
						aValue = a.createdAt;
						bValue = b.createdAt;
				}
				
				if (aValue < bValue) return -1 * sortOrder;
				if (aValue > bValue) return 1 * sortOrder;
				return 0;
			});
		}

		// Apply pagination
		const skip = (options.page - 1) * options.pageSize;
		const paginatedRequests = filteredRequests.slice(skip, skip + options.pageSize);

		return {
			items: paginatedRequests,
			totalCount: filteredRequests.length
		};
	}
}