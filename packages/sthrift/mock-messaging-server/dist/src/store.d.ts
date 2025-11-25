import type { Conversation, Message, Participant } from './types.ts';
declare class MockMessagingStore {
    private readonly conversations;
    private readonly messages;
    private readonly participants;
    private messageCounter;
    readonly ACCOUNT_ID = "mock-account-00000000";
    generateId(): string;
    createConversation(displayName?: string, uniqueName?: string): Conversation;
    createConversationWithId(id: string, displayName?: string, uniqueName?: string): Conversation;
    getConversation(id: string): Conversation | undefined;
    getConversationByUniqueName(uniqueName: string): Conversation | undefined;
    listConversations(page?: number, pageSize?: number): Conversation[];
    getConversationCount(): number;
    updateConversation(id: string, updates: Partial<Conversation>): Conversation | undefined;
    deleteConversation(id: string): boolean;
    createMessage(conversationId: string, body: string, author?: string, participantId?: string): Message | undefined;
    getMessages(conversationId: string, page?: number, pageSize?: number): Message[];
    getMessageCount(conversationId: string): number;
    getMessage(conversationId: string, messageId: string): Message | undefined;
    addParticipant(conversationId: string, identity?: string, messagingBinding?: Participant['messaging_binding']): Participant | undefined;
    getParticipants(conversationId: string, page?: number, pageSize?: number): Participant[];
    getParticipantCount(conversationId: string): number;
    getParticipant(conversationId: string, participantId: string): Participant | undefined;
    removeParticipant(conversationId: string, participantId: string): boolean;
    reset(): void;
    getStats(): {
        conversations: number;
        messages: number;
        participants: number;
    };
}
export declare const store: MockMessagingStore;
export {};
