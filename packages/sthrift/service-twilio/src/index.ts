import Twilio from 'twilio';
import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	IMessagingService,
	ConversationInstance,
	MessageInstance,
} from '@cellix/messaging';

type TwilioClient = InstanceType<typeof Twilio.Twilio> | undefined;

// Re-export types from @cellix/messaging for convenience
export type { ConversationInstance, MessageInstance, IMessagingService } from '@cellix/messaging';

/**
 * Real Twilio Service - uses official Twilio SDK
 * 
 * This service implements the IMessagingService interface using the official Twilio SDK.
 * It requires valid Twilio credentials (Account SID and Auth Token) to function.
 * 
 * For development/testing with a mock server, use @sthrift/mock-service-twilio instead.
 * 
 * @example
 * ```typescript
 * const service = new ServiceTwilioReal('AC123...', 'auth_token_123');
 * await service.startUp();
 * const conversation = await service.createConversation('Support Chat');
 * await service.sendMessage(conversation.sid, 'Hello!', 'agent@example.com');
 * ```
 */
export class ServiceTwilioReal implements IMessagingService {
	private client: TwilioClient;
	private readonly accountSid: string;
	private readonly authToken: string;

	constructor(accountSid: string, authToken: string) {
		this.accountSid = accountSid;
		this.authToken = authToken;
	}

	public async startUp(): Promise<Exclude<ServiceTwilioReal, ServiceBase>> {
		if (this.client) {
			throw new Error('ServiceTwilioReal is already started');
		}

		this.client = new Twilio.Twilio(this.accountSid, this.authToken);
		console.log('ServiceTwilioReal started with real Twilio client');
		return this as Exclude<ServiceTwilioReal, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.client) {
			throw new Error('ServiceTwilioReal is not started - shutdown cannot proceed');
		}
		this.client = undefined;
		console.log('ServiceTwilioReal stopped');
	}

	public get service(): TwilioClient {
		if (!this.client) {
			throw new Error('ServiceTwilioReal is not started - cannot access service');
		}
		return this.client;
	}

	public async getConversation(conversationId: string): Promise<ConversationInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		return await this.client.conversations.v1.conversations(conversationId).fetch();
	}

	public async sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const params: { body: string; author?: string } = { body };
		if (author) params.author = author;
		return await this.client.conversations.v1.conversations(conversationId).messages.create(params);
	}

	public async deleteConversation(conversationId: string): Promise<void> {
		if (!this.client) throw new Error('Twilio client not initialized');
		await this.client.conversations.v1.conversations(conversationId).remove();
	}

	public async listConversations(): Promise<ConversationInstance[]> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const conversationsList = await this.client.conversations.v1.conversations.list();
		return conversationsList.map(conv => ({
			sid: conv.sid,
			...(conv.friendlyName !== undefined && { friendlyName: conv.friendlyName }),
			...(conv.dateCreated && { dateCreated: conv.dateCreated }),
			...(conv.dateUpdated && { dateUpdated: conv.dateUpdated }),
		}));
	}

	public async createConversation(friendlyName?: string, uniqueName?: string): Promise<ConversationInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const params: { friendlyName?: string; uniqueName?: string } = {};
		if (friendlyName) params.friendlyName = friendlyName;
		if (uniqueName) params.uniqueName = uniqueName;
		return await this.client.conversations.v1.conversations.create(params);
	}
}
