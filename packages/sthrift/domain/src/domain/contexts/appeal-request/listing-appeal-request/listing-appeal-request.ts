import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import * as ValueObjects from './listing-appeal-request.value-objects.ts';
import type {
	ListingAppealRequestEntityReference,
	ListingAppealRequestProps,
} from './listing-appeal-request.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.ts';
import { ItemListing } from '../../listing/item/item-listing.ts';

/**
 * ListingAppealRequest aggregate root.
 * Represents an appeal request for a blocked listing with all business logic and invariants.
 */
export class ListingAppealRequest<props extends ListingAppealRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ListingAppealRequestEntityReference
{
	//#region Methods
	/**
	 * Creates a new instance of ListingAppealRequest.
	 * @param newProps - The props for the new instance
	 * @param passport - The authentication passport
	 * @param userId - The ID of the user filing the appeal
	 * @param listingId - The ID of the blocked listing
	 * @param reason - The reason for the appeal
	 * @param blockerId - The ID of the admin/user who blocked the listing
	 * @returns A new ListingAppealRequest instance
	 */
	public static getNewInstance<props extends ListingAppealRequestProps>(
		newProps: props,
		passport: Passport,
		userId: string,
		listingId: string,
		reason: string,
		blockerId: string,
	): ListingAppealRequest<props> {
		const newInstance = new ListingAppealRequest(newProps, passport);

		// Set required fields
		newInstance.props.user = { id: userId } as PersonalUserEntityReference;
		newInstance.props.listing = { id: listingId } as ItemListingEntityReference;
		newInstance.reason = reason;
		newInstance.props.state = ValueObjects.AppealRequestState.REQUESTED;
		newInstance.props.type = ValueObjects.AppealRequestType.LISTING;
		newInstance.props.blocker = { id: blockerId } as PersonalUserEntityReference;

		return newInstance;
	}
	//#endregion Methods

	//#region Properties
	get user(): PersonalUserEntityReference {
		return new PersonalUser(
			// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
			this.props.user as any,
			this.passport,
		) as PersonalUserEntityReference;
	}

	get listing(): ItemListingEntityReference {
		return new ItemListing(
			// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
			this.props.listing as any,
			this.passport,
		) as ItemListingEntityReference;
	}

	get reason(): string {
		return this.props.reason;
	}
	set reason(value: string) {
		// TODO: Add visa permission check when passport/visa are implemented
		// if (!this.isNew && !this.visa.determineIf(
		//   permissions => permissions.canUpdateAppealRequest
		// )) {
		//   throw new DomainSeedwork.PermissionError(
		//     'You do not have permission to update the reason'
		//   );
		// }
		this.props.reason = new ValueObjects.Reason(value).valueOf();
	}

	get state(): string {
		return this.props.state;
	}
	set state(value: string) {
		// TODO: Add visa permission check when passport/visa are implemented
		// if (!this.isNew && !this.visa.determineIf(
		//   permissions => permissions.canUpdateAppealRequestState
		// )) {
		//   throw new DomainSeedwork.PermissionError(
		//     'You do not have permission to update the state'
		//   );
		// }
		this.props.state = new ValueObjects.State(value).valueOf();
	}

	get type(): string {
		return this.props.type;
	}

	get blocker(): PersonalUserEntityReference {
		return new PersonalUser(
			// biome-ignore lint/suspicious/noExplicitAny: Required for cross-context entity references
			this.props.blocker as any,
			this.passport,
		) as PersonalUserEntityReference;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get schemaVersion(): string {
		return this.props.schemaVersion;
	}
	//#endregion Properties
}
