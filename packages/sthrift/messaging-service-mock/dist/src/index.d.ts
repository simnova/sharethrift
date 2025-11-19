import type { ServiceBase } from '@cellix/api-services-spec';
import type { MessagingService, ConversationInstance, MessageInstance } from '@cellix/messaging-service';
export declare class ServiceMessagingMock implements MessagingService {
    private http;
    private readonly mockBaseUrl;
    constructor(mockBaseUrl?: string);
    startUp(): Promise<Exclude<ServiceMessagingMock, ServiceBase>>;
    shutDown(): Promise<void>;
    private mapConversation;
    private mapMessage;
    getConversation(conversationId: string): Promise<ConversationInstance>;
    sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance>;
    getMessages(conversationId: string): Promise<MessageInstance[]>;
    deleteConversation(conversationId: string): Promise<void>;
    listConversations(): Promise<ConversationInstance[]>;
    createConversation(displayName?: string, uniqueIdentifier?: string): Promise<ConversationInstance>;
}
