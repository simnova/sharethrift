import twilio from 'twilio';
import { Domain } from '@ocom/api-domain';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_CONVERSATIONS_SERVICE_SID = process.env.TWILIO_CONVERSATIONS_SERVICE_SID;

export class ConversationsService {
  private conversationUoW: Domain.Contexts.ConversationUnitOfWork;
  
  constructor(conversationUoW: Domain.Contexts.ConversationUnitOfWork) {
    this.conversationUoW = conversationUoW;
  }

  async getUserConversations(userId: string): Promise<Domain.Contexts.Conversation[]> {
    const userIdVO = new Domain.Contexts.UserId(userId);
    return await this.conversationUoW.conversationRepository.getUserConversations(userIdVO);
  }

  async getConversationMessages(conversationId: string, limit = 50, offset = 0): Promise<Domain.Contexts.Message[]> {
    return await this.conversationUoW.messageRepository.getConversationMessages(
      conversationId, 
      limit, 
      offset
    );
  }

  async createConversation(listingId: string, participantIds: string[]): Promise<Domain.Contexts.Conversation> {
    if (!TWILIO_CONVERSATIONS_SERVICE_SID) {
      throw new Error('TWILIO_CONVERSATIONS_SERVICE_SID environment variable is required');
    }

    const listingIdVO = new Domain.Contexts.ListingId(listingId);
    const participantVOs = participantIds.map(id => new Domain.Contexts.UserId(id));

    // Check if conversation already exists
    const existingConversation = await this.conversationUoW.conversationRepository
      .getByListingAndParticipants(listingIdVO, participantVOs);
    
    if (existingConversation) {
      return existingConversation;
    }

    // Create conversation in Twilio
    const twilioConversation = await twilioClient.conversations.v1
      .services(TWILIO_CONVERSATIONS_SERVICE_SID)
      .conversations
      .create({
        uniqueName: `listing-${listingId}-${participantIds.sort().join('-')}`,
        friendlyName: `Conversation for Listing ${listingId}`,
        attributes: JSON.stringify({
          listingId,
          participantIds
        })
      });

    // Add participants to Twilio conversation
    for (const participantId of participantIds) {
      await twilioClient.conversations.v1
        .services(TWILIO_CONVERSATIONS_SERVICE_SID)
        .conversations(twilioConversation.sid)
        .participants
        .create({
          identity: participantId
        });
    }

    // Create conversation in our database
    const conversationId = await this.conversationUoW.conversationRepository.getNewId();
    const twilioSidVO = new Domain.Contexts.TwilioConversationSid(twilioConversation.sid);
    
    const conversation = Domain.Contexts.Conversation.create(
      conversationId,
      twilioSidVO,
      listingIdVO,
      participantVOs,
      {} // passport
    );

    await this.conversationUoW.conversationRepository.save(conversation);
    
    return conversation;
  }

  async sendMessage(conversationId: string, content: string, authorId: string): Promise<Domain.Contexts.Message> {
    if (!TWILIO_CONVERSATIONS_SERVICE_SID) {
      throw new Error('TWILIO_CONVERSATIONS_SERVICE_SID environment variable is required');
    }

    // Get conversation from database
    const conversation = await this.conversationUoW.conversationRepository.get(conversationId);
    
    // Verify author is a participant
    const authorIdVO = new Domain.Contexts.UserId(authorId);
    if (!conversation.isParticipant(authorIdVO)) {
      throw new Error('User is not a participant in this conversation');
    }

    // Send message via Twilio
    const twilioMessage = await twilioClient.conversations.v1
      .services(TWILIO_CONVERSATIONS_SERVICE_SID)
      .conversations(conversation.twilioConversationSid.valueOf())
      .messages
      .create({
        author: authorId,
        body: content
      });

    // Create message in our database
    const messageId = await this.conversationUoW.messageRepository.getNewId();
    const twilioMessageSidVO = new Domain.Contexts.TwilioMessageSid(twilioMessage.sid);
    const contentVO = new Domain.Contexts.MessageContent(content);
    
    const message = Domain.Contexts.Message.create(
      messageId,
      twilioMessageSidVO,
      conversationId,
      authorIdVO,
      contentVO,
      {} // passport
    );

    await this.conversationUoW.messageRepository.save(message);

    // Update conversation last activity
    conversation.updateLastActivity();
    await this.conversationUoW.conversationRepository.save(conversation);

    return message;
  }
}