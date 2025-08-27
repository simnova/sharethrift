
import type { ObjectId } from 'mongodb';

export class ConversationDomainAdapter extends MongooseDomainAdapter<ConversationDocument> implements DomainSeedwork.DomainEntityProps {
  get sharer(): ObjectId {
    return this.doc.sharer;
  }
  set sharer(value: ObjectId) {
    this.doc.sharer = value;
  }

  get reserver(): ObjectId {
    return this.doc.reserver;
  }
  set reserver(value: ObjectId) {
    this.doc.reserver = value;
  }

  get listing(): ObjectId {
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

  get updatedAt(): Date {
    return this.doc.updatedAt;
  }

  get id(): string {
    return this.doc._id?.toString() || '';
  }
}
