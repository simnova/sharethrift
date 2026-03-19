import { Ability } from '@serenity-js/core';
import { Domain } from '@sthrift/domain';
import { makeItemListingProps, makeSharerUser, ONE_DAY_MS, DEFAULT_SHARING_PERIOD_DAYS } from '../../../shared/support/domain-test-helpers.ts';
import { listings } from '../../../shared/support/test-data/listing.test-data.ts';

type Passport = Domain.Passport;
type ItemListingProps = Domain.Contexts.Listing.ItemListing.ItemListingProps;
type ItemListingEntityReference = Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
const ItemListing = Domain.Contexts.Listing.ItemListing.ItemListing;
const { PassportFactory } = Domain;

export class CreateListingAbility extends Ability {
	private createdListing?: ItemListingEntityReference;

	constructor(
		private readonly passport: Passport,
	) {
		super();
	}

	createDraftListing(params: {
		title?: string;
		description?: string;
		category?: string;
		location?: string;
		state?: string;
	}): void {
		const props = makeItemListingProps();
		const sharer = makeSharerUser();

		// Determine if this should be a draft based on state parameter
		// If state is "Active", isDraft is false; otherwise isDraft is true
		const isDraft = !params.state || params.state !== 'Active';

		const listing = ItemListing.getNewInstance<ItemListingProps>(
			props,
			this.passport,
			sharer,
			params.title as string,
			params.description as string,
			params.category as string,
			params.location as string,
			new Date(Date.now() + ONE_DAY_MS),
			new Date(Date.now() + ONE_DAY_MS * DEFAULT_SHARING_PERIOD_DAYS),
			[],
			isDraft,
		);

		this.createdListing = listing;
		// Store in shared test-data so sessions can access it
		listings.set(listing.id, listing);
	}

	getCreatedListing(): ItemListingEntityReference | undefined {
		return this.createdListing;
	}

	static using(): CreateListingAbility {
		return new CreateListingAbility(PassportFactory.forSystem());
	}
}
