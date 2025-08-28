import type { ObjectId } from 'mongodb';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { Models } from '@sthrift/api-data-sources-mongoose-models';
import { Domain } from '@sthrift/api-domain';

export class ConversationConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.Conversation.Conversation,
	ConversationDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Conversation.Conversation.Conversation<ConversationDomainAdapter>
> {
	constructor() {
		super(
			ConversationDomainAdapter,
			Domain.Contexts.Conversation.Conversation.Conversation,
		);
	}
}
export class ConversationDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.Conversation.Conversation>
	implements Domain.Contexts.Conversation.Conversation.ConversationProps
{
	get sharer() {
		if (!this.doc.sharer) throw new Error('sharer is not populated');
		return this.doc.sharer;
	}
	set sharer(value) {
		this.doc.sharer = value;
	}

	async loadSharer() {
		if (!this.doc.sharer) throw new Error('sharer is not populated');
		if (this.doc.sharer instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('sharer');
		}
		return this.doc.sharer;
	}

	get reserver() {
		if (!this.doc.reserver) throw new Error('reserver is not populated');
		return this.doc.reserver;
	}
	set reserver(value: ObjectId) {
		this.doc.reserver = value;
	}

	async loadReserver(): Promise<ObjectId> {
		if (!this.doc.reserver) throw new Error('reserver is not populated');
		if (this.doc.reserver instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('reserver');
		}
		return this.doc.reserver;
	}

	get listing() {
		return this.doc.listing;
	}
	set listing(value: ObjectId) {
		this.doc.listing = value;
	}

	get twilioConversationId(): string {
		return this.doc.twilioConversationId;
	}
	set twilioConversationId(value: string) {
		this.doc.twilioConversationId = value;
	}

	get schemaversion(): number {
		return this.doc.schemaversion;
	}
	set schemaversion(value: number) {
		this.doc.schemaversion = value;
	}

	get createdAt(): Date {
		return this.doc.createdAt;
	}
	override set createdAt(value: Date) {
		this.doc.createdAt = value;
	}

	override get updatedAt(): Date {
		return this.doc.updatedAt;
	}
	override set updatedAt(value: Date) {
		this.doc.updatedAt = value;
	}

	override get id(): string {
		return this.doc._id?.toString() || '';
	}
}
