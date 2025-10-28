import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';

/**
 * Props interface for ListingAppealRequest aggregate root.
 * Represents an appeal request for a blocked listing.
 */
export interface ListingAppealRequestProps
	extends DomainSeedwork.DomainEntityProps {
	/** The user who filed the appeal request */
	user: Readonly<PersonalUserEntityReference>;
	/** The blocked listing being appealed */
	listing: Readonly<ItemListingEntityReference>;
	/** The reason for the appeal */
	reason: string;
	/** The current state of the appeal request */
	state: string;
	/** The type of appeal request (always 'listing' for this subdomain) */
	type: string;
	/** The admin/user who blocked the listing (temporary: PersonalUser, future: AdminUser) */
	blocker: Readonly<PersonalUserEntityReference>;
	/** Timestamp when the appeal was created */
	readonly createdAt: Date;
	/** Timestamp when the appeal was last updated */
	updatedAt: Date;
	/** Schema version for data migration tracking */
	readonly schemaVersion: string;
}

/**
 * EntityReference interface for ListingAppealRequest.
 * Provides a read-only view of the aggregate's properties.
 */
export interface ListingAppealRequestEntityReference
	extends Readonly<ListingAppealRequestProps> {}
