import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	IMessagingService,
	ConversationInstance,
	MessageInstance,
} from '@cellix/messaging';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Re-export types from @cellix/messaging for convenience
export type { ConversationInstance, MessageInstance, IMessagingService } from '@cellix/messaging';

/**
 * Mock Twilio Service - uses mock HTTP server
 * 
 * This service implements the IMessagingService interface by making HTTP requests
 * to a mock Twilio server instead of calling the real Twilio API.
 * 
 * Requires the @sthrift/mock-twilio-server to be running.
 * 
 * @example
 * ```typescript
 * const mockService = new ServiceTwilioMock('http://localhost:10000');
 * await mockService.startUp();
 * const conversation = await mockService.createConversation('Test Chat');
 * ```
 */
export class ServiceTwilioMock implements IMessagingService {
	private http: AxiosInstance | undefined;
	private readonly mockBaseUrl: string;

	constructor(mockBaseUrl: string) {
		this.mockBaseUrl = mockBaseUrl;
	}

	public async startUp(): Promise<Exclude<ServiceTwilioMock, ServiceBase>> {
		if (this.http) {
			throw new Error('ServiceTwilioMock is already started');
		}

		this.http = axios.create({ baseURL: this.mockBaseUrl });
		console.log(`ServiceTwilioMock started in MOCK mode (${this.mockBaseUrl})`);
		return this as Exclude<ServiceTwilioMock, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.http) {
			throw new Error('ServiceTwilioMock is not started - shutdown cannot proceed');
		}
		this.http = undefined;
		console.log('ServiceTwilioMock stopped');
	}

	public async getConversation(conversationId: string): Promise<ConversationInstance> {
		if (!this.http) throw new Error('Mock client not initialized');
		const { data } = await this.http.get(`/v1/Conversations/${conversationId}`);
		return {
			sid: data.sid,
			...(data.friendly_name !== undefined && { friendlyName: data.friendly_name }),
			...(data.date_created && { dateCreated: new Date(data.date_created) }),
			...(data.date_updated && { dateUpdated: new Date(data.date_updated) }),
		};
	}


	public async sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance> {
		if (!this.http) throw new Error('Mock client not initialized');
		const payload: { Body: string; Author?: string } = { Body: body };
		if (author) payload.Author = author;
		const { data } = await this.http.post(`/v1/Conversations/${conversationId}/Messages`, payload);
		return {
			sid: data.sid,
			body: data.body,
			...(data.author !== undefined && { author: data.author }),
			...(data.date_created && { dateCreated: new Date(data.date_created) }),
		};
	}

	public async deleteConversation(conversationId: string): Promise<void> {
		if (!this.http) throw new Error('Mock client not initialized');
		await this.http.delete(`/v1/Conversations/${conversationId}`);
	}

	public async listConversations(): Promise<ConversationInstance[]> {
		if (!this.http) throw new Error('Mock client not initialized');
		const { data } = await this.http.get('/v1/Conversations');
		const conversations = data.conversations || [];
		return conversations.map((conv: any) => ({
			sid: conv.sid,
			...(conv.friendly_name !== undefined && { friendlyName: conv.friendly_name }),
			...(conv.date_created && { dateCreated: new Date(conv.date_created) }),
			...(conv.date_updated && { dateUpdated: new Date(conv.date_updated) }),
		}));
	}

	public async createConversation(friendlyName?: string, uniqueName?: string): Promise<ConversationInstance> {
		if (!this.http) throw new Error('Mock client not initialized');
		const payload: { FriendlyName?: string; UniqueName?: string } = {};
		if (friendlyName) payload.FriendlyName = friendlyName;
		if (uniqueName) payload.UniqueName = uniqueName;
		const { data } = await this.http.post('/v1/Conversations', payload);
		return {
			sid: data.sid,
			...(data.friendly_name !== undefined && { friendlyName: data.friendly_name }),
			...(data.date_created && { dateCreated: new Date(data.date_created) }),
			...(data.date_updated && { dateUpdated: new Date(data.date_updated) }),
		};
	}
}
