import axios from 'axios';
export class ServiceMessagingMock {
    http;
    mockBaseUrl;
    constructor(mockBaseUrl) {
        // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
        this.mockBaseUrl = mockBaseUrl ?? process.env['MESSAGING_MOCK_URL'] ?? 'http://localhost:10000';
    }
    async startUp() {
        if (this.http) {
            throw new Error('ServiceMessagingMock is already started');
        }
        this.http = axios.create({ baseURL: this.mockBaseUrl });
        console.log(`ServiceMessagingMock started in MOCK mode (${this.mockBaseUrl})`);
        return this;
    }
    async shutDown() {
        if (!this.http) {
            throw new Error('ServiceMessagingMock is not started - shutdown cannot proceed');
        }
        this.http = undefined;
        console.log('ServiceMessagingMock stopped');
    }
    mapConversation(mockData) {
        const mapped = {
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
            mapped.state = mockData.state;
        }
        return mapped;
    }
    mapMessage(mockData) {
        const mapped = {
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
    async getConversation(conversationId) {
        if (!this.http)
            throw new Error('Mock client not initialized');
        const { data } = await this.http.get(`/v1/Conversations/${conversationId}`);
        return this.mapConversation(data);
    }
    async sendMessage(conversationId, body, author) {
        if (!this.http)
            throw new Error('Mock client not initialized');
        const payload = { Body: body };
        if (author)
            payload.Author = author;
        const { data } = await this.http.post(`/v1/Conversations/${conversationId}/Messages`, payload);
        return this.mapMessage(data);
    }
    async getMessages(conversationId) {
        if (!this.http)
            throw new Error('Mock client not initialized');
        const { data } = await this.http.get(`/v1/Conversations/${conversationId}/Messages`);
        const messages = data.messages || [];
        return messages.map((msg) => this.mapMessage(msg));
    }
    async deleteConversation(conversationId) {
        if (!this.http)
            throw new Error('Mock client not initialized');
        await this.http.delete(`/v1/Conversations/${conversationId}`);
    }
    async listConversations() {
        if (!this.http)
            throw new Error('Mock client not initialized');
        const { data } = await this.http.get('/v1/Conversations');
        const conversations = data.conversations || [];
        return conversations.map((conv) => this.mapConversation(conv));
    }
    async createConversation(displayName, uniqueIdentifier) {
        if (!this.http)
            throw new Error('Mock client not initialized');
        const payload = {};
        if (displayName)
            payload.DisplayName = displayName;
        if (uniqueIdentifier)
            payload.UniqueName = uniqueIdentifier;
        const { data } = await this.http.post('/v1/Conversations', payload);
        return this.mapConversation(data);
    }
}
//# sourceMappingURL=index.js.map