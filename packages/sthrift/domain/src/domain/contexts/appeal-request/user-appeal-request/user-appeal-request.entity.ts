import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';

/**
 * Props interface for UserAppealRequest aggregate root.
 * Represents an appeal request for a blocked user account.
 */
export interface UserAppealRequestProps
	extends DomainSeedwork.DomainEntityProps {
	/** The user who filed the appeal request */
	user: Readonly<PersonalUserEntityReference>;
	/** Lazy load the user who filed the appeal request */
	loadUser: () => Promise<Readonly<PersonalUserEntityReference>>;
	/** The reason for the appeal */
	reason: string;
	/** The current state of the appeal request */
	state: string;
	/** The type of appeal request (always 'user' for this subdomain) */
	type: string;
	/** The admin/user who blocked the account (temporary: PersonalUser, future: AdminUser) */
	blocker: Readonly<PersonalUserEntityReference>;
	/** Lazy load the admin/user who blocked the account */
	loadBlocker: () => Promise<Readonly<PersonalUserEntityReference>>;
	/** Timestamp when the appeal was created */
	readonly createdAt: Date;
	/** Timestamp when the appeal was last updated */
	updatedAt: Date;
	/** Schema version for data migration tracking */
	readonly schemaVersion: string;
}

/**
 * EntityReference interface for UserAppealRequest.
 * Provides a read-only view of the aggregate's properties.
 */
export interface UserAppealRequestEntityReference
	extends Readonly<UserAppealRequestProps> {}
