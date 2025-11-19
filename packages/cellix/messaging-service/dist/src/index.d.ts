import type { ServiceBase } from '@cellix/api-services-spec';
export interface ConversationInstance {
    id: string;
    displayName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    state?: 'active' | 'inactive' | 'closed';
    metadata?: Record<string, unknown>;
}
export interface MessageInstance {
    id: string;
    body: string;
    author?: string;
    createdAt?: Date;
    metadata?: Record<string, unknown>;
}
export interface MessagingService extends ServiceBase<MessagingService> {
    getConversation(conversationId: string): Promise<ConversationInstance>;
    sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance>;
    getMessages(conversationId: string): Promise<MessageInstance[]>;
    deleteConversation(conversationId: string): Promise<void>;
    listConversations(): Promise<ConversationInstance[]>;
    createConversation(displayName?: string, uniqueIdentifier?: string): Promise<ConversationInstance>;
}
