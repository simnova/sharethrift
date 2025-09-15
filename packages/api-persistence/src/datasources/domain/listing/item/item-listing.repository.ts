import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { Domain } from '@sthrift/api-domain';

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
		sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListing<PropType>> {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(
			Domain.Contexts.Listing.ItemListing.ItemListing.getNewInstance(
				adapter,
				sharer,
				this.passport,
			),
		);
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

	getBySharerIDWithPagination(
		_sharerId: string,
		options: {
			page: number;
			pageSize: number;
			searchText?: string;
			statusFilters?: string[];
			sorter?: { field: string; order: 'ascend' | 'descend' };
		}
	): Promise<{
		items: Domain.Contexts.Listing.ItemListing.ItemListing<PropType>[];
		total: number;
		page: number;
		pageSize: number;
	}> {
		// TODO: Replace with real MongoDB implementation
		// For now, using mock data to match the existing implementation pattern
		return Promise.resolve(this.getMockListingsWithPagination(_sharerId, options));
	}

	private getMockListingsWithPagination(
		_sharerId: string,
		options: {
			page: number;
			pageSize: number;
			searchText?: string;
			statusFilters?: string[];
			sorter?: { field: string; order: 'ascend' | 'descend' };
		}
	) {
		// Mock data for listings
		const mockListings = [
			{
				id: '6324a3f1e3e4e1e6a8e1d8b1',
				sharer: 'currentUser',
				title: 'Cordless Drill',
				description: 'Professional grade cordless drill with multiple attachments.',
				category: 'Tools & Equipment',
				location: 'Philadelphia, PA',
				sharingPeriodStart: new Date('2020-11-08'),
				sharingPeriodEnd: new Date('2020-12-23'),
				publishedAt: new Date('2025-12-23').toISOString(),
				status: 'Paused',
				pendingRequestsCount: 0,
				image: '/assets/item-images/projector.png',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d8b7',
				sharer: 'currentUser',
				title: 'Electric Guitar',
				description: 'Fender Stratocaster, perfect for gigs and practice.',
				category: 'Music & Instruments',
				location: 'Philadelphia, PA',
				sharingPeriodStart: new Date('2025-09-01'),
				sharingPeriodEnd: new Date('2025-09-30'),
				publishedAt: new Date('2025-08-30').toISOString(),
				status: 'Active',
				pendingRequestsCount: 3,
				image: '/assets/item-images/projector.png',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d8b8',
				sharer: 'currentUser',
				title: 'Stand Mixer',
				description: 'KitchenAid stand mixer, great for baking.',
				category: 'Home & Kitchen',
				location: 'Philadelphia, PA',
				sharingPeriodStart: new Date('2025-10-01'),
				sharingPeriodEnd: new Date('2025-10-15'),
				publishedAt: new Date('2025-09-28').toISOString(),
				status: 'Reserved',
				pendingRequestsCount: 1,
				image: '/assets/item-images/sewing-machine.png',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d8b9',
				sharer: 'currentUser',
				title: 'Bubble Chair',
				description: 'Modern bubble chair, transparent acrylic.',
				category: 'Furniture',
				location: 'Philadelphia, PA',
				sharingPeriodStart: new Date('2025-11-01'),
				sharingPeriodEnd: new Date('2025-11-15'),
				publishedAt: new Date('2025-10-30').toISOString(),
				status: 'Draft',
				pendingRequestsCount: 0,
				image: '/assets/item-images/bubble-chair.png',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d8c0',
				sharer: 'currentUser',
				title: 'Projector',
				description: 'HD projector, great for movie nights.',
				category: 'Electronics',
				location: 'Philadelphia, PA',
				sharingPeriodStart: new Date('2025-12-01'),
				sharingPeriodEnd: new Date('2025-12-10'),
				publishedAt: new Date('2025-11-28').toISOString(),
				status: 'Blocked',
				pendingRequestsCount: 0,
				image: '/assets/item-images/projector.png',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d8b2',
				sharer: 'currentUser',
				title: 'City Bike',
				description: 'Perfect city bike for commuting and leisure rides.',
				category: 'Vehicles & Transportation',
				location: 'Philadelphia, PA',
				sharingPeriodStart: new Date('2020-11-08'),
				sharingPeriodEnd: new Date('2020-12-23'),
				publishedAt: new Date('2025-01-03').toISOString(),
				status: 'Active',
				pendingRequestsCount: 2,
				image: '/assets/item-images/bike.png',
			},
			{
				id: '6324a3f1e3e4e1e6a8e1d8b3',
				sharer: 'currentUser',
				title: 'Sewing Kit',
				description: 'Complete sewing kit with threads, needles, and accessories.',
				category: 'Home & Garden',
				location: 'Philadelphia, PA',
				sharingPeriodStart: new Date('2020-11-08'),
				sharingPeriodEnd: new Date('2020-12-23'),
				publishedAt: new Date('2025-01-12').toISOString(),
				status: 'Expired',
				pendingRequestsCount: 0,
				image: '/assets/item-images/sewing-machine.png',
			},
		];

		let filteredListings = mockListings;

		// Apply search text filter
		if (options.searchText) {
			filteredListings = filteredListings.filter((listing) =>
				listing.title.toLowerCase().includes(options.searchText?.toLowerCase() || ''),
			);
		}

		// Apply status filters
		if (options.statusFilters && options.statusFilters.length > 0) {
			filteredListings = filteredListings.filter((listing) =>
				options.statusFilters?.includes(listing.status),
			);
		}

		// Apply sorter
		if (options.sorter?.field) {
			filteredListings.sort((a, b) => {
				const fieldA = a[options.sorter?.field as keyof typeof a];
				const fieldB = b[options.sorter?.field as keyof typeof b];

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

		const total = filteredListings.length;
		const startIndex = (options.page - 1) * options.pageSize;
		const endIndex = startIndex + options.pageSize;
		const items = filteredListings.slice(startIndex, endIndex);

		// Convert mock data to domain objects (simplified for now)
		const domainItems = items.map((item) => ({
			...item,
			reservationPeriod: `${item.sharingPeriodStart.toISOString().slice(0, 10)} - ${item.sharingPeriodEnd.toISOString().slice(0, 10)}`,
		})) as unknown as Domain.Contexts.Listing.ItemListing.ItemListing<PropType>[]; // TODO: Properly convert to domain objects

		return {
			items: domainItems,
			total,
			page: options.page,
			pageSize: options.pageSize,
		};
	}
}
