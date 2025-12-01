import type { ServiceBase } from '@cellix/api-services-spec';

/**
 * Email recipient information
 */
export interface EmailRecipient {
	email: string;
	name?: string;
}

/**
 * Email template data with variable substitution
 */
export interface EmailTemplateData {
	[key: string]: string | number | boolean | Date;
}

/**
 * Generic transactional email service interface
 * This interface abstracts all email provider implementations
 */
export interface TransactionalEmailService extends ServiceBase {
	/**
	 * Send a transactional email using a named template
	 * @param templateName - Name of the email template to use
	 * @param recipient - Email recipient information
	 * @param templateData - Data to substitute in the template
	 * @returns Promise that resolves when email is sent or queued
	 */
	sendTemplatedEmail(
		templateName: string,
		recipient: EmailRecipient,
		templateData: EmailTemplateData,
	): Promise<void>;
}