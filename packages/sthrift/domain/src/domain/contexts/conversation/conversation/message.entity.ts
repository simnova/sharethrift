import { DomainSeedwork } from '@cellix/domain-seedwork';
import type * as ValueObjects from './message.value-objects.ts';

export interface MessageProps extends DomainSeedwork.DomainEntityProps {
	messagingMessageId: ValueObjects.MessagingMessageId;
	authorId: ValueObjects.AuthorId;
	contents: ValueObjects.MessageContents;
	createdAt: Date;
}

export interface MessageEntityReference extends Readonly<MessageProps> {}

export class Message
	extends DomainSeedwork.DomainEntity<MessageProps>
	implements MessageEntityReference
{
	get messagingMessageId() {
		return this.props.messagingMessageId;
	}
	get authorId() {
		return this.props.authorId;
	}
	get contents() {
		return this.props.contents;
	}
	get createdAt() {
		return this.props.createdAt;
	}
}
