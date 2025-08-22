import TwilioPkg from 'twilio';
const { Twilio } = TwilioPkg;
import type { ServiceBase } from '@cellix/api-services-spec';

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
  private client: InstanceType<typeof Twilio> | undefined;

  public startUp(): Promise<Exclude<ServiceTwilio, ServiceBase<ServiceTwilio>>> {
    if (this.client) {
      throw new Error('ServiceTwilio is already started');
    }
    if (!process.env['TWILIO_ACCOUNT_SID'] || !process.env['TWILIO_AUTH_TOKEN']) {
      throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables');
    }
    this.client = new Twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);
    console.log('ServiceTwilio started');

    return this as Exclude<ServiceTwilio, ServiceBase<ServiceTwilio>>;
  }

  public shutDown(): Promise<void> {
    if (!this.client) {
      throw new Error('ServiceTwilio is not started - shutdown cannot proceed');
    }
    this.client = undefined;
    console.log('ServiceTwilio stopped');
    return Promise.resolve();
  }

  public get service(): InstanceType<typeof Twilio> {
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
    const result = await this.client.conversations.v1.conversations(conversationId)
      .messages.create(params);
    return result;
  }

  public async deleteConversation(conversationId: string): Promise<void> {
    if (!this.client) throw new Error('Twilio client not initialized');
    await this.client.conversations.v1.conversations(conversationId).remove();
  }
}