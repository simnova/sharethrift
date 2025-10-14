import { DomainSeedwork } from '@cellix/domain-seedwork';
import type * as ValueObjects from './message.value-objects.ts';
import type { ObjectId } from 'bson';

export interface MessageProps extends DomainSeedwork.DomainEntityProps {
	twilioMessageSid: ValueObjects.TwilioMessageSid;
	authorId: ObjectId;
	content: ValueObjects.MessageContent;
	createdAt: Date;
}

export interface MessageEntityReference extends Readonly<MessageProps> {}

export class Message
	extends DomainSeedwork.DomainEntity<MessageProps>
	implements MessageEntityReference
{
	get twilioMessageSid() {
		return this.props.twilioMessageSid;
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
