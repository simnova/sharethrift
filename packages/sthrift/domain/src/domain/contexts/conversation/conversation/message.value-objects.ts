import { VOString } from '@lucaspaganini/value-objects';
import { ObjectId } from '../../value-objects.ts';

// Constant for messages with unknown/anonymous authors
export const ANONYMOUS_AUTHOR_ID = '000000000000000000000000';

export class AuthorId extends ObjectId {}

// Messaging provider message ID value object
export class MessagingMessageId extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 255,
}) {}

// Twilio-specific message ID value object
export class TwilioMessageSid extends VOString({
	trim: true,
	minLength: 34,
	maxLength: 34,
	pattern: /^IM[a-zA-Z0-9]{32}$/,
}) {}

// Message content value object
export class MessageContent extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 2000,
}) {}
