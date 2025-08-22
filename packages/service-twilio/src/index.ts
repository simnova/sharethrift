import type { ServiceBase } from '@cellix/api-services-spec';
import { Twilio } from 'twilio';
import type { TwilioConfig } from './service-twilio.js';
import type { ConversationInstance } from 'twilio/lib/rest/conversations/v1/conversation';


export class ServiceTwilio implements ServiceBase<never> {
  private readonly config: TwilioConfig;
  private client: Twilio | undefined;

  constructor(config: TwilioConfig) {
    if (!config.accountSid || !config.authToken) {
      throw new Error('TwilioConfig is missing required fields.');
    }
    this.config = config;
  }

  public startUp(): ServiceTwilio {
    if (this.client) {
      throw new Error('ServiceTwilio is already started');
    }
    this.client = new Twilio(this.config.accountSid, this.config.authToken);
    console.log('ServiceTwilio started');
    return this;
  }

  public shutDown(): Promise<void> {
    if (!this.client) {
      throw new Error('ServiceTwilio is not started - shutdown cannot proceed');
    }
    this.client = undefined;
    console.log('ServiceTwilio stopped');
  }

  public get service(): Twilio {
    if (!this.client) {
      throw new Error('ServiceTwilio is not started - cannot access service');
    }
    return this.client;
  }

  private async getConversation(conversationId: string): Promise<ConversationInstance> {
    if (!this.client) throw new Error('Twilio client not initialized');
    return await this.client.conversations.v1.conversations(conversationId).fetch();
  }

  private async sendMessage(conversationId: string, body: string, author?: string): Promise<ReturnType<Twilio['conversations']['messages']>['create']> {
    if (!this.client) throw new Error('Twilio client not initialized');
    return await this.client.conversations.v1.conversations(conversationId)
      .messages.create({ body, author });
  }

  private async deleteConversation(conversationId: string): Promise<void> {
    if (!this.client) throw new Error('Twilio client not initialized');
    await this.client.conversations.v1.conversations(conversationId).remove();
  }
}