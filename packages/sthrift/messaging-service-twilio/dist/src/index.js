import Twilio from 'twilio';
export class ServiceMessagingTwilio {
    client;
    accountSid;
    authToken;
    constructor(accountSid, authToken) {
        // TODO: Uncomment when Twilio API keys are configured in deployed environment
        // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
        // this.accountSid = accountSid ?? process.env['TWILIO_ACCOUNT_SID'] ?? '';
        // biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
        // this.authToken = authToken ?? process.env['TWILIO_AUTH_TOKEN'] ?? '';
        this.accountSid = accountSid ?? '';
        this.authToken = authToken ?? '';
        if (!this.accountSid || !this.authToken) {
            console.warn('ServiceMessagingTwilio: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN not configured. Service will not function until credentials are provided.');
        }
    }
    startUp() {
        if (this.client) {
            throw new Error('ServiceMessagingTwilio is already started');
        }
        if (process.env['NODE_ENV'] === 'development') {
            this.client = new Twilio.Twilio(this.accountSid, this.authToken);
        }
        return this;
    }
    shutDown() {
        this.client = undefined;
        return Promise.resolve();
    }
    get service() {
        if (!this.client) {
            throw new Error('ServiceMessagingTwilio is not started - cannot access service');
        }
        return this.client;
    }
    mapConversation(twilioConv) {
        const mapped = {
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
            mapped.state = twilioConv.state;
        }
        return mapped;
    }
    mapMessage(twilioMsg) {
        const mapped = {
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
    async getConversation(conversationId) {
        if (!this.client)
            throw new Error('Twilio client not initialized');
        const twilioConv = await this.client.conversations.v1.conversations(conversationId).fetch();
        return this.mapConversation(twilioConv);
    }
    async sendMessage(conversationId, body, author) {
        if (!this.client)
            throw new Error('Twilio client not initialized');
        const params = { body };
        if (author)
            params.author = author;
        const twilioMsg = await this.client.conversations.v1.conversations(conversationId).messages.create(params);
        return this.mapMessage(twilioMsg);
    }
    async getMessages(conversationId) {
        if (!this.client)
            throw new Error('Twilio client not initialized');
        const messagesList = await this.client.conversations.v1.conversations(conversationId).messages.list();
        return messagesList.map(msg => this.mapMessage(msg));
    }
    async deleteConversation(conversationId) {
        if (!this.client)
            throw new Error('Twilio client not initialized');
        await this.client.conversations.v1.conversations(conversationId).remove();
    }
    async listConversations() {
        if (!this.client)
            throw new Error('Twilio client not initialized');
        const conversationsList = await this.client.conversations.v1.conversations.list();
        return conversationsList.map(conv => this.mapConversation(conv));
    }
    async createConversation(displayName, uniqueIdentifier) {
        if (!this.client)
            throw new Error('Twilio client not initialized');
        const params = {};
        if (displayName)
            params.friendlyName = displayName;
        if (uniqueIdentifier)
            params.uniqueName = uniqueIdentifier;
        const twilioConv = await this.client.conversations.v1.conversations.create(params);
        return this.mapConversation(twilioConv);
    }
}
//# sourceMappingURL=index.js.map