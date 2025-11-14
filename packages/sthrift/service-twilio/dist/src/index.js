import { Twilio } from 'twilio';
export class ServiceTwilio {
    client;
    startUp() {
        if (this.client) {
            throw new Error('ServiceTwilio is already started');
        }
        if (!process.env['TWILIO_ACCOUNT_SID'] ||
            !process.env['TWILIO_AUTH_TOKEN']) {
            throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables');
        }
        this.client = new Twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);
        console.log('ServiceTwilio started');
        return Promise.resolve(this);
    }
    shutDown() {
        if (!this.client) {
            throw new Error('ServiceTwilio is not started - shutdown cannot proceed');
        }
        this.client = undefined;
        console.log('ServiceTwilio stopped');
        return Promise.resolve();
    }
    get service() {
        if (!this.client) {
            throw new Error('ServiceTwilio is not started - cannot access service');
        }
        return this.client;
    }
    async getConversation(conversationId) {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }
        return await this.client.conversations.v1
            .conversations(conversationId)
            .fetch();
    }
    async sendMessage(conversationId, body, author) {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }
        const params = { body };
        if (author) {
            params.author = author;
        }
        return await this.client.conversations.v1
            .conversations(conversationId)
            .messages.create(params);
    }
    async deleteConversation(conversationId) {
        if (!this.client) {
            throw new Error('Twilio client not initialized');
        }
        await this.client.conversations.v1.conversations(conversationId).remove();
    }
}
//# sourceMappingURL=index.js.map