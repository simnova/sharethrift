import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { TwilioConversationSid, UserId, ListingId } from './conversation.value-objects.js';

export interface ConversationProps extends DomainSeedwork.DomainEntityProps {
  twilioConversationSid: TwilioConversationSid;
  listingId: ListingId;
  participants: UserId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationEntityReference extends Readonly<ConversationProps> {}

export type ConversationPassport = Record<string, never>;

export class Conversation extends DomainSeedwork.AggregateRoot<ConversationProps, ConversationPassport> implements ConversationEntityReference {
  get twilioConversationSid() {
    return this.props.twilioConversationSid;
  }
  get listingId() {
    return this.props.listingId;
  }
  get participants() {
    return [...this.props.participants];
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  public static create(
    id: string,
    twilioConversationSid: TwilioConversationSid,
    listingId: ListingId,
    participants: UserId[],
    passport: ConversationPassport
  ): Conversation {
    const now = new Date();
    return new Conversation({
      id,
      twilioConversationSid,
      listingId,
      participants,
      createdAt: now,
      updatedAt: now,
    }, passport);
  }
  public addParticipant(userId: UserId): void {
    if (!this.props.participants.some((p: UserId) => p.valueOf() === userId.valueOf())) {
      this.props.participants.push(userId);
      this.props.updatedAt = new Date();
    }
  }
  public isParticipant(userId: UserId): boolean {
    return this.props.participants.some((p: UserId) => p.valueOf() === userId.valueOf());
  }
  public updateLastActivity(): void {
    this.props.updatedAt = new Date();
  }
}
