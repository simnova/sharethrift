import { VOString } from '@lucaspaganini/value-objects';

// Twilio Message SID value object
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
