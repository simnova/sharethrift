import Twilio from 'twilio';
import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	MessagingService,
	ConversationInstance,
	MessageInstance,
} from '@cellix/messaging-service';

type TwilioClient = InstanceType<typeof Twilio.Twilio> | undefined;

export class ServiceMessagingTwilio implements MessagingService {
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
				'ServiceMessagingTwilio requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN (via constructor or environment variables)'
			);
		}
	}

	public async startUp(): Promise<Exclude<ServiceMessagingTwilio, ServiceBase>> {
		if (this.client) {
			throw new Error('ServiceMessagingTwilio is already started');
		}

		this.client = new Twilio.Twilio(this.accountSid, this.authToken);
		console.log('ServiceMessagingTwilio started with real Twilio client');
		return this as Exclude<ServiceMessagingTwilio, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.client) {
			throw new Error('ServiceMessagingTwilio is not started - shutdown cannot proceed');
		}
		this.client = undefined;
		console.log('ServiceMessagingTwilio stopped');
	}

	public get service(): TwilioClient {
		if (!this.client) {
			throw new Error('ServiceMessagingTwilio is not started - cannot access service');
		}
		return this.client;
	}

	private mapConversation(twilioConv: any): ConversationInstance {
		const mapped: ConversationInstance = {
			id: twilioConv.sid,
			metadata: {
				twilioSid: twilioConv.sid,
				accountSid: twilioConv.accountSid,
				uniqueName: twilioConv.uniqueName,
				// Preserve other Twilio-specific fields
			},
		};
		
		if (twilioConv.friendlyName !== undefined) {
			mapped.displayName = twilioConv.friendlyName;
		}
		if (twilioConv.dateCreated !== undefined) {
			mapped.createdAt = twilioConv.dateCreated;
		}
		if (twilioConv.dateUpdated !== undefined) {
			mapped.updatedAt = twilioConv.dateUpdated;
		}
		if (twilioConv.state !== undefined) {
			mapped.state = twilioConv.state as 'active' | 'inactive' | 'closed';
		}
		
		return mapped;
	}

	private mapMessage(twilioMsg: any): MessageInstance {
		const mapped: MessageInstance = {
			id: twilioMsg.sid,
			body: twilioMsg.body || '',
			metadata: {
				twilioSid: twilioMsg.sid,
				conversationSid: twilioMsg.conversationSid,
				participantSid: twilioMsg.participantSid,
				index: twilioMsg.index,
				// Preserve other Twilio-specific fields
			},
		};
		
		if (twilioMsg.author !== undefined) {
			mapped.author = twilioMsg.author;
		}
		if (twilioMsg.dateCreated !== undefined) {
			mapped.createdAt = twilioMsg.dateCreated;
		}
		
		return mapped;
	}

	public async getConversation(conversationId: string): Promise<ConversationInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const twilioConv = await this.client.conversations.v1.conversations(conversationId).fetch();
		return this.mapConversation(twilioConv);
	}

	public async sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const params: { body: string; author?: string } = { body };
		if (author) params.author = author;
		const twilioMsg = await this.client.conversations.v1.conversations(conversationId).messages.create(params);
		return this.mapMessage(twilioMsg);
	}
	
	public async getMessages(conversationId: string): Promise<MessageInstance[]> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const messagesList = await this.client.conversations.v1.conversations(conversationId).messages.list();
		return messagesList.map(msg => this.mapMessage(msg));
	}

	public async deleteConversation(conversationId: string): Promise<void> {
		if (!this.client) throw new Error('Twilio client not initialized');
		await this.client.conversations.v1.conversations(conversationId).remove();
	}

	public async listConversations(): Promise<ConversationInstance[]> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const conversationsList = await this.client.conversations.v1.conversations.list();
		return conversationsList.map(conv => this.mapConversation(conv));
	}

	public async createConversation(displayName?: string, uniqueIdentifier?: string): Promise<ConversationInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const params: { friendlyName?: string; uniqueName?: string } = {};
		if (displayName) params.friendlyName = displayName;
		if (uniqueIdentifier) params.uniqueName = uniqueIdentifier;
		const twilioConv = await this.client.conversations.v1.conversations.create(params);
		return this.mapConversation(twilioConv);
	}
}
