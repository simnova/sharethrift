import { VOArray, VOString } from '@lucaspaganini/value-objects';
import { ObjectId } from '../../value-objects.ts';

export class AuthorId extends ObjectId {}

// Messaging provider message ID value object
export class MessagingMessageId extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 255,
}) {}

// Value object for validating a single text content item within a message.
export class MessageText extends VOString({
	trim: true,
	minLength: 1,
	maxLength: 2000,
}) {}

// Value object for an array of message content items.
export class MessageContents extends VOArray(MessageText, {
	minLength: 1,
	maxLength: 10,
}) {}
