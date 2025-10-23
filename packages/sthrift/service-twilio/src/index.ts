import { Twilio } from 'twilio';
import type { ServiceBase } from '@cellix/api-services-spec';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

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

/**
 * Internal API interface for Twilio operations
 * Implemented by both real and mock adapters
 */
interface TwilioAPI {
	getConversation(id: string): Promise<ConversationInstance>;
	sendMessage(id: string, body: string, author?: string): Promise<MessageInstance>;
	deleteConversation(id: string): Promise<void>;
	listConversations(): Promise<ConversationInstance[]>;
	createConversation(friendlyName?: string, uniqueName?: string): Promise<ConversationInstance>;
}

/**
 * Real Twilio API adapter - delegates to official Twilio SDK
 */
class RealTwilioAPI implements TwilioAPI {
	private readonly client: TwilioClient;

	constructor(client: TwilioClient) {
		this.client = client;
	}

	async getConversation(id: string): Promise<ConversationInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		return await this.client.conversations.v1.conversations(id).fetch();
	}

	async sendMessage(id: string, body: string, author?: string): Promise<MessageInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const params: { body: string; author?: string } = { body };
		if (author) params.author = author;
		return await this.client.conversations.v1.conversations(id).messages.create(params);
	}

	async deleteConversation(id: string): Promise<void> {
		if (!this.client) throw new Error('Twilio client not initialized');
		await this.client.conversations.v1.conversations(id).remove();
	}

	async listConversations(): Promise<ConversationInstance[]> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const conversationsList = await this.client.conversations.v1.conversations.list();
		return conversationsList.map(conv => ({
			sid: conv.sid,
			...(conv.friendlyName !== undefined && { friendlyName: conv.friendlyName }),
			...(conv.dateCreated && { dateCreated: conv.dateCreated }),
			...(conv.dateUpdated && { dateUpdated: conv.dateUpdated }),
		}));
	}

	async createConversation(friendlyName?: string, uniqueName?: string): Promise<ConversationInstance> {
		if (!this.client) throw new Error('Twilio client not initialized');
		const params: { friendlyName?: string; uniqueName?: string } = {};
		if (friendlyName) params.friendlyName = friendlyName;
		if (uniqueName) params.uniqueName = uniqueName;
		return await this.client.conversations.v1.conversations.create(params);
	}
}

/**
 * Mock Twilio API adapter - delegates to mock HTTP server
 */
class MockTwilioAPI implements TwilioAPI {
	private readonly http: AxiosInstance;

	constructor(http: AxiosInstance) {
		this.http = http;
	}

	async getConversation(id: string): Promise<ConversationInstance> {
		const { data } = await this.http.get(`/v1/Conversations/${id}`);
		return {
			sid: data.sid,
			...(data.friendly_name !== undefined && { friendlyName: data.friendly_name }),
			...(data.date_created && { dateCreated: new Date(data.date_created) }),
			...(data.date_updated && { dateUpdated: new Date(data.date_updated) }),
		};
	}

	async sendMessage(id: string, body: string, author?: string): Promise<MessageInstance> {
		const payload: { Body: string; Author?: string } = { Body: body };
		if (author) payload.Author = author;
		const { data } = await this.http.post(`/v1/Conversations/${id}/Messages`, payload);
		return {
			sid: data.sid,
			body: data.body,
			...(data.author !== undefined && { author: data.author }),
			...(data.date_created && { dateCreated: new Date(data.date_created) }),
		};
	}

	async deleteConversation(id: string): Promise<void> {
		await this.http.delete(`/v1/Conversations/${id}`);
	}

	async listConversations(): Promise<ConversationInstance[]> {
		const { data } = await this.http.get('/v1/Conversations');
		const conversations = data.conversations || [];
		return conversations.map((conv: any) => ({
			sid: conv.sid,
			...(conv.friendly_name !== undefined && { friendlyName: conv.friendly_name }),
			...(conv.date_created && { dateCreated: new Date(conv.date_created) }),
			...(conv.date_updated && { dateUpdated: new Date(conv.date_updated) }),
		}));
	}

	async createConversation(friendlyName?: string, uniqueName?: string): Promise<ConversationInstance> {
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

export class ServiceTwilio implements ServiceBase<ServiceTwilio> {
	private client: TwilioClient;
	private mockClient: AxiosInstance | undefined;
	private useMock: boolean;
	private mockBaseUrl: string;
	private api!: TwilioAPI;

	constructor() {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.useMock = process.env['TWILIO_USE_MOCK'] === 'true';
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.mockBaseUrl = process.env['TWILIO_MOCK_URL'] ?? 'http://localhost:10000';
	}

	public startUp(): Promise<Exclude<ServiceTwilio, ServiceBase>> {
		if (this.client || this.mockClient) {
			throw new Error('ServiceTwilio is already started');
		}

		if (this.useMock) {
			// Use mock server via HTTP client
			this.mockClient = axios.create({ baseURL: this.mockBaseUrl });
			this.api = new MockTwilioAPI(this.mockClient);
			console.log(`ServiceTwilio started in MOCK mode (${this.mockBaseUrl})`);
		} else {
			// Use real Twilio client
			// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
			if (!process.env['TWILIO_ACCOUNT_SID'] || !process.env['TWILIO_AUTH_TOKEN']) {
				throw new Error(
					'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables',
				);
			}
			// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
			this.client = new Twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);
			this.api = new RealTwilioAPI(this.client);
			console.log('ServiceTwilio started with real Twilio client');
		}

		return Promise.resolve(this as Exclude<ServiceTwilio, ServiceBase>);
	}

	public shutDown(): Promise<void> {
		if (!this.client && !this.mockClient) {
			throw new Error('ServiceTwilio is not started - shutdown cannot proceed');
		}
		this.client = undefined;
		this.mockClient = undefined;
		console.log('ServiceTwilio stopped');
		return Promise.resolve();
	}

	public get service(): TwilioClient {
		if (!this.client && !this.useMock) {
			throw new Error('ServiceTwilio is not started - cannot access service');
		}
		return this.client;
	}

	public getConversation(conversationId: string): Promise<ConversationInstance> {
		return this.api.getConversation(conversationId);
	}

	public sendMessage(conversationId: string, body: string, author?: string): Promise<MessageInstance> {
		return this.api.sendMessage(conversationId, body, author);
	}

	public deleteConversation(conversationId: string): Promise<void> {
		return this.api.deleteConversation(conversationId);
	}

	public listConversations(): Promise<ConversationInstance[]> {
		return this.api.listConversations();
	}

	public createConversation(friendlyName?: string, uniqueName?: string): Promise<ConversationInstance> {
		return this.api.createConversation(friendlyName, uniqueName);
	}
}
