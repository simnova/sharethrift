import { DomainSeedwork } from '@cellix/domain-seedwork';
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
import * as AppealRequestHelpers from '../appeal-request.helpers.ts';

export class ListingAppealRequest<props extends ListingAppealRequestProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ListingAppealRequestEntityReference
{
	private readonly visa: AppealRequestVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.appealRequest.forListingAppealRequest(this);
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

	get user(): PersonalUserEntityReference {
		return AppealRequestHelpers.getUserReference(this.props.user, this.passport);
	}

	async loadUser(): Promise<PersonalUserEntityReference> {
		return await this.props.loadUser();
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

	get reason(): string {
		return this.props.reason;
	}
	
	set reason(value: string) {
		AppealRequestHelpers.updateReason(this.props, value, this.visa, ValueObjects.Reason);
	}

	get state(): string {
		return this.props.state;
	}
	
	set state(value: string) {
		AppealRequestHelpers.updateState(this.props, value, this.visa, ValueObjects.State);
	}

	get type(): string {
		return this.props.type;
	}

	get blocker(): PersonalUserEntityReference {
		return AppealRequestHelpers.getBlockerReference(this.props.blocker, this.passport);
	}

	async loadBlocker(): Promise<PersonalUserEntityReference> {
		return await this.props.loadBlocker();
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
}
