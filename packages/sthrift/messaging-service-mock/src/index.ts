import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	MessagingService,
	ConversationInstance,
	MessageInstance,
} from '@cellix/messaging-service';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

export class ServiceMessagingMock implements MessagingService {
	private http: AxiosInstance | undefined;
	private readonly mockBaseUrl: string;

	constructor(mockBaseUrl?: string) {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.mockBaseUrl = mockBaseUrl ?? process.env['MESSAGING_MOCK_URL'] ?? 'http://localhost:10000';
	}

	public async startUp(): Promise<Exclude<ServiceMessagingMock, ServiceBase>> {
		if (this.http) {
			throw new Error('ServiceMessagingMock is already started');
		}

		this.http = axios.create({ baseURL: this.mockBaseUrl });
		console.log(`ServiceMessagingMock started in MOCK mode (${this.mockBaseUrl})`);
		return this as Exclude<ServiceMessagingMock, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.http) {
			throw new Error('ServiceMessagingMock is not started - shutdown cannot proceed');
		}
		this.http = undefined;
		console.log('ServiceMessagingMock stopped');
	}

	private mapConversation(mockData: any): ConversationInstance {
		const mapped: ConversationInstance = {
			id: mockData.id,
			metadata: {
				mockServerId: mockData.id,
				accountId: mockData.account_id,
				uniqueName: mockData.unique_name,
			},
		};
		
		if (mockData.display_name !== undefined) {
			mapped.displayName = mockData.display_name;
		}
		if (mockData.created_at) {
			mapped.createdAt = new Date(mockData.created_at);
		}
		if (mockData.updated_at) {
			mapped.updatedAt = new Date(mockData.updated_at);
		}
		if (mockData.state !== undefined) {
			mapped.state = mockData.state as 'active' | 'inactive' | 'closed';
		}
		
		return mapped;
	}

	private mapMessage(mockData: any): MessageInstance {
		const mapped: MessageInstance = {
			id: mockData.id,
			body: mockData.body || '',
			metadata: {
				mockServerId: mockData.id,
				conversationId: mockData.conversation_id,
				participantId: mockData.participant_id,
				index: mockData.index,
			},
		};
		
		if (mockData.author !== undefined) {
			mapped.author = mockData.author;
		}
		if (mockData.created_at) {
			mapped.createdAt = new Date(mockData.created_at);
		}
		
		return mapped;
	}

	public async getConversation(conversationId: string): Promise<ConversationInstance> {
		if (!this.http) throw new Error('Mock client not initialized');
		const { data } = await this.http.get(`/v1/Conversations/${conversationId}`);
		return this.mapConversation(data);
	}


	public async sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance> {
		if (!this.http) throw new Error('Mock client not initialized');
		const payload: { Body: string; Author?: string } = { Body: body };
		if (author) payload.Author = author;
		const { data } = await this.http.post(`/v1/Conversations/${conversationId}/Messages`, payload);
		return this.mapMessage(data);
	}
	
	public async getMessages(conversationId: string): Promise<MessageInstance[]> {
		if (!this.http) throw new Error('Mock client not initialized');
		const { data } = await this.http.get(`/v1/Conversations/${conversationId}/Messages`);
		const messages = data.messages || [];
		return messages.map((msg: any) => this.mapMessage(msg));
	}

	public async deleteConversation(conversationId: string): Promise<void> {
		if (!this.http) throw new Error('Mock client not initialized');
		await this.http.delete(`/v1/Conversations/${conversationId}`);
	}

	public async listConversations(): Promise<ConversationInstance[]> {
		if (!this.http) throw new Error('Mock client not initialized');
		const { data } = await this.http.get('/v1/Conversations');
		const conversations = data.conversations || [];
		return conversations.map((conv: any) => this.mapConversation(conv));
	}

	public async createConversation(displayName?: string, uniqueIdentifier?: string): Promise<ConversationInstance> {
		if (!this.http) throw new Error('Mock client not initialized');
		const payload: { DisplayName?: string; UniqueName?: string } = {};
		if (displayName) payload.DisplayName = displayName;
		if (uniqueIdentifier) payload.UniqueName = uniqueIdentifier;
		const { data } = await this.http.post('/v1/Conversations', payload);
		return this.mapConversation(data);
	}
}
