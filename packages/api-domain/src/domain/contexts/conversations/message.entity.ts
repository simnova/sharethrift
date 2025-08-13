import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { TwilioMessageSid, MessageContent, UserId } from './conversation.value-objects.js';

export interface MessageProps extends DomainSeedwork.DomainEntityProps {
  twilioMessageSid: TwilioMessageSid;
  conversationId: string;
  authorId: UserId;
  content: MessageContent;
  createdAt: Date;
}

export interface MessageEntityReference extends Readonly<MessageProps> {}

export class Message extends DomainSeedwork.DomainEntity<MessageProps> implements MessageEntityReference {
  get twilioMessageSid() {
    return this.props.twilioMessageSid;
  }
  get conversationId() {
    return this.props.conversationId;
  }
  get authorId() {
    return this.props.authorId;
  }
  get content() {
    return this.props.content;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
