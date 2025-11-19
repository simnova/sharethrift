import type { Passport } from '../../passport.ts';
import type { AppealRequestVisa } from '../appeal-request.visa.ts';
import * as ValueObjects from './listing-appeal-request.value-objects.ts';
import type {
	ListingAppealRequestEntityReference,
	ListingAppealRequestProps,
} from './listing-appeal-request.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import { ItemListing } from '../../listing/item/item-listing.ts';
import { AppealRequestBase } from '../base-appeal-request.ts';

export class ListingAppealRequest<props extends ListingAppealRequestProps>
	extends AppealRequestBase<props>
	implements ListingAppealRequestEntityReference
{
	protected createVisa(passport: Passport): AppealRequestVisa {
		return passport.appealRequest.forListingAppealRequest(this);
	}

	public static getNewInstance<props extends ListingAppealRequestProps>(
		newProps: props,
		passport: Passport,
		userId: string,
		listingId: string,
		reason: string,
		blockerId: string,
	): ListingAppealRequest<props> {
		const newInstance = new ListingAppealRequest(newProps, passport);

		newInstance.props.user = { id: userId } as PersonalUserEntityReference;
		newInstance.props.listing = { id: listingId } as ItemListingEntityReference;
		newInstance.reason = reason;
		newInstance.props.state = ValueObjects.AppealRequestState.REQUESTED;
		newInstance.props.type = ValueObjects.AppealRequestType.LISTING;
		newInstance.props.blocker = { id: blockerId } as PersonalUserEntityReference;

		return newInstance;
	}

	get listing(): ItemListingEntityReference {
		return new ItemListing(
			// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
			this.props.listing as any,
			this.passport,
		) as ItemListingEntityReference;
	}

	async loadListing(): Promise<ItemListingEntityReference> {
		return await this.props.loadListing();
	}
}
