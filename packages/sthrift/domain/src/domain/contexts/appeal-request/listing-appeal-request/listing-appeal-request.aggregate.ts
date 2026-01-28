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
import { PersonalUser } from '../../user/personal-user/personal-user.aggregate.ts';
import { ItemListing } from '../../listing/item/item-listing.aggregate.ts';

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

	async loadUser(): Promise<PersonalUserEntityReference> {
		return await this.props.loadUser();
	}

	async loadListing(): Promise<ItemListingEntityReference> {
		return await this.props.loadListing();
	}

	async loadBlocker(): Promise<PersonalUserEntityReference> {
		return await this.props.loadBlocker();
	}

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
		if (
			!this.visa.determineIf(
				(permissions) => permissions.canUpdateAppealRequestState,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update the reason',
			);
		}
		this.props.reason = new ValueObjects.Reason(value).valueOf();
	}

	get state(): string {
		return this.props.state;
	}
	set state(value: string) {
		if (
			!this.visa.determineIf(
				(permissions) => permissions.canUpdateAppealRequestState,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to update the state',
			);
		}
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
}
