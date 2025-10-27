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
 * Twilio Service - uses official Twilio SDK
 * 
 * This service implements the IMessagingService interface using the official Twilio SDK.
 * It requires valid Twilio credentials (Account SID and Auth Token) to function.
 * 
 * For development/testing with a mock server, use MockServiceTwilio from @sthrift/mock-service-twilio instead.
 * 
 * @example
 * ```typescript
 * const service = new ServiceTwilio('AC123...', 'auth_token_123');
 * await service.startUp();
 * const conversation = await service.createConversation('Support Chat');
 * await service.sendMessage(conversation.sid, 'Hello!', 'agent@example.com');
 * ```
 */
export class ServiceTwilio implements IMessagingService {
	private client: TwilioClient;
	private readonly accountSid: string;
	private readonly authToken: string;

	constructor(accountSid?: string, authToken?: string) {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.accountSid = accountSid ?? process.env['TWILIO_ACCOUNT_SID'] ?? '';
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.authToken = authToken ?? process.env['TWILIO_AUTH_TOKEN'] ?? '';
		
		if (!this.accountSid || !this.authToken) {
			throw new Error(
				'ServiceTwilio requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN (via constructor or environment variables)'
			);
		}
	}

	public async startUp(): Promise<Exclude<ServiceTwilio, ServiceBase>> {
		if (this.client) {
			throw new Error('ServiceTwilio is already started');
		}

		this.client = new Twilio.Twilio(this.accountSid, this.authToken);
		console.log('ServiceTwilio started with real Twilio client');
		return this as Exclude<ServiceTwilio, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.client) {
			throw new Error('ServiceTwilio is not started - shutdown cannot proceed');
		}
		this.client = undefined;
		console.log('ServiceTwilio stopped');
	}

	public get service(): TwilioClient {
		if (!this.client) {
			throw new Error('ServiceTwilio is not started - cannot access service');
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
	
	public async getMessages(conversationId: string): Promise<MessageInstance[]> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const messagesList = await this.client.conversations.v1.conversations(conversationId).messages.list();
		return messagesList.map(msg => ({
			sid: msg.sid,
			body: msg.body,
			...(msg.author !== undefined && { author: msg.author }),
			...(msg.dateCreated && { dateCreated: msg.dateCreated }),
		}));
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
