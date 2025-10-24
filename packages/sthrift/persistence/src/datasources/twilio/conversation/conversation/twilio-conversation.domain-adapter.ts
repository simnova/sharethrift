import { Domain } from '@sthrift/domain';
import type {
	TwilioConversationResponse,
	TwilioMessageResponse,
} from './twilio-conversation.types.ts';
import { ObjectId } from 'bson';

/**
 * Adapter to convert Twilio API responses to Domain entities
 * This bridges the gap between external Twilio data structure and internal domain models
 */

/**
 * Convert Twilio conversation response to domain Conversation props
 * Note: This creates a simplified adapter that can be used to construct domain entities
 */
export function toDomainConversationProps(
		twilioConversation: TwilioConversationResponse,
		sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		messages: Domain.Contexts.Conversation.Conversation.MessageEntityReference[],
	): Domain.Contexts.Conversation.Conversation.ConversationProps {
		return {
			id: twilioConversation.sid, // Use Twilio SID as the ID
			sharer,
			loadSharer: async () => sharer,
			reserver,
			loadReserver: async () => reserver,
			listing,
			loadListing: async () => listing,
			twilioConversationId: twilioConversation.sid,
			messages,
			loadMessages: async () => messages,
			createdAt: new Date(twilioConversation.date_created),
			updatedAt: new Date(twilioConversation.date_updated),
			schemaVersion: '1.0.0',
		};
	}

/**
 * Convert Twilio message response to domain Message entity
 */
export function toDomainMessage(
		twilioMessage: TwilioMessageResponse,
		authorId: ObjectId,
	): Domain.Contexts.Conversation.Conversation.MessageEntityReference {
		const twilioMessageSid = new Domain.Contexts.Conversation.Conversation.TwilioMessageSid(
			twilioMessage.sid,
		);
		const content = new Domain.Contexts.Conversation.Conversation.MessageContent(
			twilioMessage.body,
		);

		return new Domain.Contexts.Conversation.Conversation.Message({
			id: twilioMessage.sid,
			twilioMessageSid,
			authorId,
			content,
			createdAt: new Date(twilioMessage.date_created),
		});
	}/**
 * Convert array of Twilio messages to domain Message entities
 */
export function toDomainMessages(
	twilioMessages: TwilioMessageResponse[],
	authorIdMap: Map<string, ObjectId>, // Maps author email/identity to ObjectId
): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
	return twilioMessages.map((msg) => {
		const authorId = msg.author
			? (authorIdMap.get(msg.author) ?? new ObjectId())
			: new ObjectId();
		return toDomainMessage(msg, authorId);
	});
}
