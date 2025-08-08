import type { Domain } from '@ocom/api-domain';
import type { ConversationsService } from './conversations.service.js';

export interface ConversationResolvers {
  id: (parent: Domain.Contexts.Conversation) => string;
  twilioConversationSid: (parent: Domain.Contexts.Conversation) => string;
  listingId: (parent: Domain.Contexts.Conversation) => string;
  participants: (parent: Domain.Contexts.Conversation) => string[];
  createdAt: (parent: Domain.Contexts.Conversation) => string;
  updatedAt: (parent: Domain.Contexts.Conversation) => string;
}

export interface MessageResolvers {
  id: (parent: Domain.Contexts.Message) => string;
  twilioMessageSid: (parent: Domain.Contexts.Message) => string;
  conversationId: (parent: Domain.Contexts.Message) => string;
  authorId: (parent: Domain.Contexts.Message) => string;
  content: (parent: Domain.Contexts.Message) => string;
  createdAt: (parent: Domain.Contexts.Message) => string;
}

export interface QueryResolvers {
  getUserConversations: (
    parent: unknown,
    args: { userId: string },
    context: { conversationsService: ConversationsService }
  ) => Promise<Domain.Contexts.Conversation[]>;
  
  getConversationMessages: (
    parent: unknown,
    args: { conversationId: string; limit?: number; offset?: number },
    context: { conversationsService: ConversationsService }
  ) => Promise<Domain.Contexts.Message[]>;
}

export interface MutationResolvers {
  createConversation: (
    parent: unknown,
    args: { input: { listingId: string; participantIds: string[] } },
    context: { conversationsService: ConversationsService }
  ) => Promise<Domain.Contexts.Conversation>;
  
  sendMessage: (
    parent: unknown,
    args: { input: { conversationId: string; content: string; authorId: string } },
    context: { conversationsService: ConversationsService }
  ) => Promise<Domain.Contexts.Message>;
}

export const conversationResolvers: ConversationResolvers = {
  id: (parent) => parent.id,
  twilioConversationSid: (parent) => parent.twilioConversationSid.valueOf(),
  listingId: (parent) => parent.listingId.valueOf(),
  participants: (parent) => parent.participants.map((p: Domain.Contexts.UserId) => p.valueOf()),
  createdAt: (parent) => parent.createdAt.toISOString(),
  updatedAt: (parent) => parent.updatedAt.toISOString(),
};

export const messageResolvers: MessageResolvers = {
  id: (parent) => parent.id,
  twilioMessageSid: (parent) => parent.twilioMessageSid.valueOf(),
  conversationId: (parent) => parent.conversationId,
  authorId: (parent) => parent.authorId.valueOf(),
  content: (parent) => parent.content.valueOf(),
  createdAt: (parent) => parent.createdAt.toISOString(),
};

export const queryResolvers: QueryResolvers = {
  getUserConversations: async (_, { userId }, { conversationsService }) => {
    return await conversationsService.getUserConversations(userId);
  },
  
  getConversationMessages: async (_, { conversationId, limit, offset }, { conversationsService }) => {
    return await conversationsService.getConversationMessages(conversationId, limit, offset);
  },
};

export const mutationResolvers: MutationResolvers = {
  createConversation: async (_, { input }, { conversationsService }) => {
    return await conversationsService.createConversation(input.listingId, input.participantIds);
  },
  
  sendMessage: async (_, { input }, { conversationsService }) => {
    return await conversationsService.sendMessage(input.conversationId, input.content, input.authorId);
  },
};