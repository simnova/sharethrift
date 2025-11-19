import Twilio from 'twilio';
import type { ServiceBase } from '@cellix/api-services-spec';
import type { MessagingService, ConversationInstance, MessageInstance } from '@cellix/messaging-service';
type TwilioClient = InstanceType<typeof Twilio.Twilio> | undefined;
export declare class ServiceMessagingTwilio implements MessagingService {
    private client;
    private readonly accountSid;
    private readonly authToken;
    constructor(accountSid?: string, authToken?: string);
    startUp(): Promise<Exclude<ServiceMessagingTwilio, ServiceBase>>;
    shutDown(): Promise<void>;
    get service(): TwilioClient;
    private mapConversation;
    private mapMessage;
    getConversation(conversationId: string): Promise<ConversationInstance>;
    sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance>;
    getMessages(conversationId: string): Promise<MessageInstance[]>;
    deleteConversation(conversationId: string): Promise<void>;
    listConversations(): Promise<ConversationInstance[]>;
    createConversation(displayName?: string, uniqueIdentifier?: string): Promise<ConversationInstance>;
}
export {};
