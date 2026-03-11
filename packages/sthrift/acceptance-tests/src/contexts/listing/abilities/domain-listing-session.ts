import { Domain } from '@sthrift/domain';
import { DomainSession } from '../../../shared/abilities/domain-session.js';
import type { CreateItemListingInput } from './listing-types.js';
import { makeItemListingProps, makeSharerUser, makeTestPassport } from '../../../shared/support/domain-test-helpers.js';

type ItemListingEntityReference = Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
type ItemListingProps = Domain.Contexts.Listing.ItemListing.ItemListingProps;
const ItemListingAggregate = Domain.Contexts.Listing.ItemListing.ItemListing;

export class DomainListingSession extends DomainSession {
	private readonly listings: Map<string, ItemListingEntityReference>;
	context = 'listing';

	constructor(sharedStore?: Map<string, ItemListingEntityReference>) {
		super();
		this.listings = sharedStore || new Map<string, ItemListingEntityReference>();
		this.registerOperation('listing:create', (input) =>
			this.handleCreateListing(input as unknown as CreateItemListingInput),
		);
		this.registerOperation('listing:getById', (input) =>
			this.handleGetListingById(input as unknown as { id: string }),
		);
	}

	createItemListing(input: CreateItemListingInput): Promise<ItemListingEntityReference> {
		return this.execute<CreateItemListingInput, ItemListingEntityReference>('listing:create', input);
	}

	getListingById(id: string): Promise<ItemListingEntityReference | null> {
		return this.execute<{ id: string }, ItemListingEntityReference | null>('listing:getById', { id });
	}

	private handleCreateListing(input: CreateItemListingInput): Promise<ItemListingEntityReference> {
		const passport = makeTestPassport();
		const sharer = makeSharerUser();
		const props = makeItemListingProps({ id: `listing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` });

		const aggregate = ItemListingAggregate.getNewInstance<ItemListingProps>(
			props,
			passport,
			sharer,
			input.title,
			input.description,
			input.category,
			input.location,
			input.sharingPeriodStart,
			input.sharingPeriodEnd,
			input.images,
			input.isDraft,
		);

		const listing = {
			id: aggregate.id,
			sharer,
			title: aggregate.title,
			description: aggregate.description,
			category: aggregate.category,
			location: aggregate.location,
			state: aggregate.state,
			sharingPeriodStart: aggregate.sharingPeriodStart,
			sharingPeriodEnd: aggregate.sharingPeriodEnd,
			images: aggregate.images ?? [],
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
			listingType: 'item-sharing',
			isBlocked: false,
			hasReports: false,
			loadSharer: async () => sharer,
			loadListing: async () => null as never,
			loadReserver: async () => null as never,
		} as ItemListingEntityReference;

		this.listings.set(listing.id, listing);
		return Promise.resolve(listing);
	}

	private handleGetListingById(input: { id: string }): Promise<ItemListingEntityReference | null> {
		return Promise.resolve(this.listings.get(input.id) || null);
	}
}
