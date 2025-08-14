import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Conversation /*, ConversationProps, ConversationEntityReference */} from './conversation.aggregate.ts';
import type { TwilioConversationSid, UserId, ListingId } from './conversation.value-objects.ts';

/**
 * Repository interface for Conversation aggregate root.
 * Provides domain-specific methods for retrieving and managing conversations.
 */
export interface ConversationRepository extends DomainSeedwork.Repository<Conversation> {
  /**
   * Generates a new unique ID for a Conversation.
   */
  getNewId(): Promise<string>;

  /**
   * Retrieves a conversation by its Twilio SID.
   */
  getByTwilioSid(twilioSid: TwilioConversationSid): Promise<Conversation | null>;

  /**
   * Retrieves a conversation by listing and participants.
   */
  getByListingAndParticipants(listingId: ListingId, participants: UserId[]): Promise<Conversation | null>;

  /**
   * Retrieves all conversations for a user.
   */
  getUserConversations(userId: UserId): Promise<Conversation[]>;
}
