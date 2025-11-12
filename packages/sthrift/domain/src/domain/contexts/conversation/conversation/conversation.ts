import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ConversationVisa } from '../conversation.visa.ts';
import type { Passport } from '../../passport.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import { ItemListing } from '../../listing/item/item-listing.ts';
import type {
	ConversationEntityReference,
	ConversationProps,
} from './conversation.entity.ts';
import type { MessageEntityReference } from "./message.entity.ts";

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
		sharer: PersonalUserEntityReference,
		reserver: PersonalUserEntityReference,
		listing: ItemListingEntityReference,
		_messages: MessageEntityReference[],
		messagingConversationId: string | undefined,
		passport: Passport,
	): Conversation<props> {
		const instance = new Conversation(newProps, passport);
		instance.markAsNew();
		instance.sharer = sharer;
		instance.reserver = reserver;
		instance.listing = listing;
		if (messagingConversationId) {
			instance.messagingConversationId = messagingConversationId;
		}
		instance.isNew = false;
		return instance;
	}

	private markAsNew(): void {
		this.isNew = true;
		// Optionally emit integration event for aggregate creation
		// this.addIntegrationEvent(ConversationCreatedEvent, { conversationId: this.props.id });
	}

	get sharer(): PersonalUserEntityReference {
		return new PersonalUser(this.props.sharer, this.passport);
	}

	async loadSharer(): Promise<PersonalUserEntityReference> {
		return await this.props.loadSharer();
	}

	private set sharer(sharer: PersonalUserEntityReference | null | undefined) {
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

	get reserver(): PersonalUserEntityReference {
		return new PersonalUser(this.props.reserver, this.passport);
	}

	async loadReserver(): Promise<PersonalUserEntityReference> {
		return await this.props.loadReserver();
	}

	private set reserver(reserver:
		| PersonalUserEntityReference
		| null
		| undefined) {
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
	 * Mark this conversation as deleted. This is typically used when cascading deletes
	 * from a listing deletion.
	 */
	public setDeleted(deleted: boolean): void {
		super.isDeleted = deleted;
	}
}
