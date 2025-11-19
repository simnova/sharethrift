import type { ServiceBase } from '@cellix/api-services-spec';

/**
 * Email template data containing sender, subject, and HTML body
 */
export interface EmailTemplate {
	fromEmail: string;
	subject: string;
	body: string;
}

/**
 * Generic interface for transactional email services.
 * Hides vendor-specific implementation details and provides
 * a simple, consistent API for sending transactional emails.
 */
export interface TransactionalEmailService extends ServiceBase<TransactionalEmailService> {
	/**
	 * Send an email with a magic link for authentication
	 * @param userEmail - Recipient email address
	 * @param magicLink - The magic link URL to include in the email
	 */
	sendEmailWithMagicLink(userEmail: string, magicLink: string): Promise<void>;
}
