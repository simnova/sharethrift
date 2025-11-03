import { VOString } from '@lucaspaganini/value-objects';

// Messaging provider message ID value object
export class MessagingMessageId extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 255,
}) {}

// Message content value object
export class MessageContent extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 2000,
}) {}
