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

export class ServiceTwilio implements ServiceBase<ServiceTwilio> {
	private client: TwilioClient;
	private mockClient: AxiosInstance | undefined;
	private useMock: boolean;
	private mockBaseUrl: string;

	constructor() {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.useMock = process.env['TWILIO_USE_MOCK'] === 'true';
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.mockBaseUrl = process.env['TWILIO_MOCK_URL'] ?? 'http://localhost:3004';
	}

	public startUp(): Promise<Exclude<ServiceTwilio, ServiceBase>> {
		if (this.client || this.mockClient) {
			throw new Error('ServiceTwilio is already started');
		}

		if (this.useMock) {
			// Use mock server via HTTP client
			this.mockClient = axios.create({ baseURL: this.mockBaseUrl });
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

	public async getConversation(
		conversationId: string,
	): Promise<ConversationInstance> {
		if (this.useMock && this.mockClient) {
			// Mock implementation via HTTP
			try {
				const { data } = await this.mockClient.get(`/v1/Conversations/${conversationId}`);
				return {
					sid: data.sid,
					...(data.friendly_name !== undefined && { friendlyName: data.friendly_name }),
					...(data.date_created && { dateCreated: new Date(data.date_created) }),
					...(data.date_updated && { dateUpdated: new Date(data.date_updated) }),
				};
			} catch (error) {
				console.error('Error fetching conversation from mock server:', error);
				throw error;
			}
		} else {
			// Real Twilio implementation
			if (!this.client) { throw new Error('Twilio client not initialized'); }
			return await this.client.conversations.v1
				.conversations(conversationId)
				.fetch();
		}
	}

	public async sendMessage(
		conversationId: string,
		body: string,
		author?: string,
	): Promise<MessageInstance> {
		if (this.useMock && this.mockClient) {
			// Mock implementation via HTTP
			try {
				const payload: { Body: string; Author?: string } = { Body: body };
				if (author) { payload.Author = author; }
				
				const { data } = await this.mockClient.post(
					`/v1/Conversations/${conversationId}/Messages`,
					payload
				);
				
				return {
					sid: data.sid,
					body: data.body,
					...(data.author !== undefined && { author: data.author }),
					...(data.date_created && { dateCreated: new Date(data.date_created) }),
				};
			} catch (error) {
				console.error('Error sending message to mock server:', error);
				throw error;
			}
		} else {
			// Real Twilio implementation
			if (!this.client) { throw new Error('Twilio client not initialized'); }
			const params: { body: string; author?: string } = { body };
			if (author) { params.author = author; }
			return await this.client.conversations.v1
				.conversations(conversationId)
				.messages.create(params);
		}
	}

	public async deleteConversation(conversationId: string): Promise<void> {
		if (this.useMock && this.mockClient) {
			// Mock implementation via HTTP
			try {
				await this.mockClient.delete(`/v1/Conversations/${conversationId}`);
			} catch (error) {
				console.error('Error deleting conversation from mock server:', error);
				throw error;
			}
		} else {
			// Real Twilio implementation
			if (!this.client) { throw new Error('Twilio client not initialized'); }
			await this.client.conversations.v1.conversations(conversationId).remove();
		}
	}

	public async listConversations(): Promise<ConversationInstance[]> {
		if (this.useMock && this.mockClient) {
			// Mock implementation via HTTP
			try {
				const { data } = await this.mockClient.get('/v1/Conversations');
				const conversations = data.conversations || [];
				return conversations.map((conv: any) => ({
					sid: conv.sid,
					...(conv.friendly_name !== undefined && { friendlyName: conv.friendly_name }),
					...(conv.date_created && { dateCreated: new Date(conv.date_created) }),
					...(conv.date_updated && { dateUpdated: new Date(conv.date_updated) }),
				}));
			} catch (error) {
				console.error('Error listing conversations from mock server:', error);
				throw error;
			}
		} else {
			// Real Twilio implementation
			if (!this.client) { throw new Error('Twilio client not initialized'); }
			const conversationsList = await this.client.conversations.v1.conversations.list();
			return conversationsList.map(conv => ({
				sid: conv.sid,
				...(conv.friendlyName !== undefined && { friendlyName: conv.friendlyName }),
				...(conv.dateCreated && { dateCreated: conv.dateCreated }),
				...(conv.dateUpdated && { dateUpdated: conv.dateUpdated }),
			}));
		}
	}

	public async createConversation(
		friendlyName?: string,
		uniqueName?: string,
	): Promise<ConversationInstance> {
		if (this.useMock && this.mockClient) {
			// Mock implementation via HTTP
			try {
				const payload: { FriendlyName?: string; UniqueName?: string } = {};
				if (friendlyName) { payload.FriendlyName = friendlyName; }
				if (uniqueName) { payload.UniqueName = uniqueName; }
				
				const { data } = await this.mockClient.post('/v1/Conversations', payload);
				
				return {
					sid: data.sid,
					...(data.friendly_name !== undefined && { friendlyName: data.friendly_name }),
					...(data.date_created && { dateCreated: new Date(data.date_created) }),
					...(data.date_updated && { dateUpdated: new Date(data.date_updated) }),
				};
			} catch (error) {
				console.error('Error creating conversation in mock server:', error);
				throw error;
			}
		} else {
			// Real Twilio implementation
			if (!this.client) { throw new Error('Twilio client not initialized'); }
			const params: { friendlyName?: string; uniqueName?: string } = {};
			if (friendlyName) { params.friendlyName = friendlyName; }
			if (uniqueName) { params.uniqueName = uniqueName; }
			return await this.client.conversations.v1.conversations.create(params);
		}
	}
}
