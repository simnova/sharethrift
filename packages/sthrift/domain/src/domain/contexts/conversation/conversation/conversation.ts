import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ConversationVisa } from '../conversation.visa.ts';
import type { Passport } from '../../passport.ts';
import type { UserEntityReference } from '../../user/index.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.ts';
import { AdminUser } from '../../user/admin-user/admin-user.ts';
import type { AdminUserProps } from '../../user/admin-user/admin-user.entity.ts';
import type { PersonalUserProps } from '../../user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import { ItemListing } from '../../listing/item/item-listing.ts';
import type {
	ConversationEntityReference,
	ConversationProps,
} from './conversation.entity.ts';
import type { MessageEntityReference } from './message.entity.ts';

export class Conversation<props extends ConversationProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements ConversationEntityReference
{
	private isNew: boolean = false;
	private readonly visa: ConversationVisa;

	//#region Constructor
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.conversation.forConversation(this);
	}

	public static getNewInstance<props extends ConversationProps>(
		newProps: props,
		sharer: UserEntityReference,
		reserver: UserEntityReference,
		listing: ItemListingEntityReference,
		_messages: MessageEntityReference[],
		messagingConversationId: string | undefined,
		passport: Passport,
	): Conversation<props> {
		const newInstance = new Conversation(newProps, passport);
		newInstance.markAsNew();
		newInstance.sharer = sharer;
		newInstance.reserver = reserver;
		newInstance.listing = listing;
		newInstance.props.messages = _messages;
		if (messagingConversationId) {
			newInstance.messagingConversationId = messagingConversationId;
		}
		newInstance.isNew = false;
		return newInstance;
	}

	private markAsNew(): void {
		this.isNew = true;
		// Optionally emit integration event for aggregate creation
		// this.addIntegrationEvent(ConversationCreatedEvent, { conversationId: this.props.id });
	}

	get sharer(): UserEntityReference {
		// Polymorphic instantiation based on userType
		if (this.props.sharer.userType === 'admin-user') {
			return new AdminUser(
				this.props.sharer as unknown as AdminUserProps,
				this.passport,
			);
		}
		return new PersonalUser(
			this.props.sharer as unknown as PersonalUserProps,
			this.passport,
		);
	}

	async loadSharer(): Promise<UserEntityReference> {
		return await this.props.loadSharer();
	}

	private set sharer(sharer: UserEntityReference | null | undefined) {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canManageConversation,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to change the sharer of this conversation',
			);
		}
		if (sharer === null || sharer === undefined) {
			throw new DomainSeedwork.PermissionError(
				'sharer cannot be null or undefined',
			);
		}
		this.props.sharer = sharer;
	}

	get reserver(): UserEntityReference {
		// Polymorphic instantiation based on userType
		if (this.props.reserver.userType === 'admin-user') {
			return new AdminUser(
				this.props.reserver as unknown as AdminUserProps,
				this.passport,
			);
		}
		return new PersonalUser(
			this.props.reserver as unknown as PersonalUserProps,
			this.passport,
		);
	}

	async loadReserver(): Promise<UserEntityReference> {
		return await this.props.loadReserver();
	}

	private set reserver(reserver: UserEntityReference | null | undefined) {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canManageConversation,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to change the reserver of this conversation',
			);
		}
		if (reserver === null || reserver === undefined) {
			throw new DomainSeedwork.PermissionError(
				'reserver cannot be null or undefined',
			);
		}
		this.props.reserver = reserver;
	}

	async loadMessages(): Promise<readonly MessageEntityReference[]> {
		return await this.props.loadMessages();
	}

	get messages(): readonly MessageEntityReference[] {
		return this.props.messages;
	}

	get listing(): ItemListingEntityReference {
		return new ItemListing(this.props.listing, this.passport);
	}

	async loadListing(): Promise<ItemListingEntityReference> {
		return await this.props.loadListing();
	}

	private set listing(listing: ItemListingEntityReference | null | undefined) {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canManageConversation,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to change the listing of this conversation',
			);
		}
		if (listing === null || listing === undefined) {
			throw new DomainSeedwork.PermissionError(
				'listing cannot be null or undefined',
			);
		}
		this.props.listing = listing;
	}

	get messagingConversationId(): string {
		return this.props.messagingConversationId;
	}
	set messagingConversationId(value: string) {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canManageConversation,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to change the messagingConversationId of this conversation',
			);
		}
		this.props.messagingConversationId = value;
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

	/**
	 * Gets the expiration date for this conversation.
	 * When set, the conversation will be automatically deleted by the TTL mechanism
	 * after this date passes.
	 */
	get expiresAt(): Date | undefined {
		return this.props.expiresAt;
	}

	/**
	 * Sets the expiration date for this conversation.
	 * Should be set to 6 months after the associated listing expires, is cancelled,
	 * or the related reservation request is completed/closed.
	 * @param value - The expiration date, or undefined to remove expiration
	 */
	set expiresAt(value: Date | undefined) {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canManageConversation,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to change the expiration date of this conversation',
			);
		}
		this.props.expiresAt = value;
	}

	/**
	 * Schedules this conversation for deletion after the retention period.
	 * Per the data retention strategy, conversations are deleted 6 months after
	 * the associated listing or reservation request reaches a terminal state.
	 * @param archivalDate - The date when the associated listing/reservation became archived
	 */
	public scheduleForDeletion(archivalDate: Date): void {
		if (
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canManageConversation,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to schedule this conversation for deletion',
			);
		}
		const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000; // Approximately 6 months in milliseconds
		this.props.expiresAt = new Date(archivalDate.getTime() + SIX_MONTHS_MS);
	}
}
