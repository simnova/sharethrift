import { Twilio } from 'twilio';
import type { ServiceBase } from '@cellix/api-services-spec';
type TwilioClient = InstanceType<typeof Twilio> | undefined;
export interface ConversationInstance {
    sid: string;
    friendlyName?: string;
    dateCreated?: Date;
    dateUpdated?: Date;
}
export interface MessageInstance {
    sid: string;
    body: string;
    author?: string;
    dateCreated?: Date;
}
export declare class ServiceTwilio implements ServiceBase<ServiceTwilio> {
    private client;
    startUp(): Promise<Exclude<ServiceTwilio, ServiceBase>>;
    shutDown(): Promise<void>;
    get service(): TwilioClient;
    getConversation(conversationId: string): Promise<ConversationInstance>;
    sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance>;
    deleteConversation(conversationId: string): Promise<void>;
}
export {};
