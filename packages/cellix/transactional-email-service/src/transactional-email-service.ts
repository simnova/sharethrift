import type { ServiceBase } from '@cellix/api-services-spec';

export interface EmailRecipient {
	email: string;
	name?: string;
}

export interface EmailTemplateData {
	[key: string]: string | number | boolean | Date;
}

export interface TransactionalEmailService extends ServiceBase {
	sendTemplatedEmail(
		templateName: string,
		recipient: EmailRecipient,
		templateData: EmailTemplateData,
	): Promise<void>;
}