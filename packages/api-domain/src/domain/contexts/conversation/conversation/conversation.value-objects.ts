import { VOString } from '@lucaspaganini/value-objects';

// Twilio Conversation SID value object
export class TwilioConversationSid extends VOString({
	trim: true,
	minLength: 34,
	maxLength: 34,
	pattern: /^CH[a-zA-Z0-9]{32}$/,
}) {}

// Twilio Participant SID value object
export class TwilioParticipantSid extends VOString({
	trim: true,
	minLength: 34,
	maxLength: 34,
	pattern: /^MB[a-zA-Z0-9]{32}$/,
}) {}
