import { DomainSeedwork } from '@cellix/domain-seedwork';

import type { ObjectId } from 'mongodb';
import type { ConversationVisa } from '../conversation.visa.ts';
import type { Passport } from '../../passport.ts';

export interface ConversationProps extends DomainSeedwork.DomainEntityProps {
	sharer: ObjectId;
	reserver: ObjectId;
	listing: ObjectId;
	twilioConversationId: string;
	schemaversion: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ConversationEntityReference
	extends Readonly<ConversationProps> {}

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
		sharer: ObjectId,
		reserver: ObjectId,
		listing: ObjectId,
		twilioConversationId: string,
		schemaversion: number,
		passport: Passport,
	): Conversation<props> {
		const now = new Date();
		const instance = new Conversation(
			{
				...newProps,
				sharer,
				reserver,
				listing,
				twilioConversationId,
				schemaversion,
				createdAt: now,
				updatedAt: now,
			} as props,
			passport,
		);
		instance.markAsNew();
		instance.isNew = false;
		return instance;
	}

	private markAsNew(): void {
		this.isNew = true;
		// Optionally emit integration event for aggregate creation
		// this.addIntegrationEvent(ConversationCreatedEvent, { conversationId: this.props.id });
	}

	get sharer(): ObjectId {
		return this.props.sharer;
	}
	set sharer(value: ObjectId) {
		this.props.sharer = value;
	}

	get reserver(): ObjectId {
		return this.props.reserver;
	}
	set reserver(value: ObjectId) {
		this.props.reserver = value;
	}

	get listing(): ObjectId {
		return this.props.listing;
	}
	set listing(value: ObjectId) {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(domainPermissions: { canCreateConversation: boolean }) =>
					domainPermissions.canCreateConversation,
			)
		) {
			throw new Error('Listing cannot be changed after creation.');
		}
		this.props.listing = value;
	}

	get twilioConversationId(): string {
		return this.props.twilioConversationId;
	}
	set twilioConversationId(value: string) {
		this.props.twilioConversationId = value;
	}

	get schemaversion(): number {
		return this.props.schemaversion;
	}
	set schemaversion(value: number) {
		this.props.schemaversion = value;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	public updateLastActivity(): void {
		this.props.updatedAt = new Date();
	}
	//#endregion Properties
}
