import { Domain } from '@sthrift/domain';
import { DomainSession } from '../../../shared/abilities/domain-session.js';
import type { CreateItemListingInput, ItemListing } from './listing-session.js';
import { makeItemListingProps, makeSharerUser, makeTestPassport } from '../../../shared/support/domain-test-helpers.js';

type ItemListingProps = Domain.Contexts.Listing.ItemListing.ItemListingProps;
const ItemListingAggregate = Domain.Contexts.Listing.ItemListing.ItemListing;

export class DomainListingSession extends DomainSession {
	private readonly listings: Map<string, ItemListing>;
	context = 'listing';

	constructor(sharedStore?: Map<string, ItemListing>) {
		super();
		this.listings = sharedStore || new Map<string, ItemListing>();
		this.registerOperation('listing:create', (input) =>
			this.handleCreateListing(input as unknown as CreateItemListingInput),
		);
		this.registerOperation('listing:getById', (input) =>
			this.handleGetListingById(input as unknown as { id: string }),
		);
	}

	createItemListing(input: CreateItemListingInput): Promise<ItemListing> {
		return this.execute<CreateItemListingInput, ItemListing>('listing:create', input);
	}

	getListingById(id: string): Promise<ItemListing | null> {
		return this.execute<{ id: string }, ItemListing | null>('listing:getById', { id });
	}

	private handleCreateListing(input: CreateItemListingInput): Promise<ItemListing> {
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

		const listing: ItemListing = {
			id: aggregate.id,
			title: aggregate.title,
			description: aggregate.description,
			category: aggregate.category,
			location: aggregate.location,
			state: (aggregate.state === 'Draft' ? 'draft' : aggregate.state) as ItemListing['state'],
			sharingPeriodStart: aggregate.sharingPeriodStart,
			sharingPeriodEnd: aggregate.sharingPeriodEnd,
			images: aggregate.images ?? [],
		};

		this.listings.set(listing.id, listing);
		return Promise.resolve(listing);
	}

	private handleGetListingById(input: { id: string }): Promise<ItemListing | null> {
		return Promise.resolve(this.listings.get(input.id) || null);
	}
}
