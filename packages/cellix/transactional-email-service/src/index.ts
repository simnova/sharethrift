import type { ServiceBase } from '@cellix/api-services-spec';

/**
 * Represents the data required to send a transactional email.
 * This is a minimal, generic interface that hides proprietary details
 * of specific email service providers.
 */
export interface EmailMessage {
	/** Recipient email address */
	to: string;
	/** Sender email address */
	from: string;
	/** Email subject line */
	subject: string;
	/** HTML content of the email */
	html: string;
}

/**
 * Generic interface for transactional email services.
 * Implementations can be swapped without affecting upstream code.
 * 
 * Examples of possible implementations:
 * - SendGrid
 * - Azure Communication Services
 * - Mock (for local development/testing)
 */
export interface TransactionalEmailService extends ServiceBase<TransactionalEmailService> {
	/**
	 * Send a transactional email.
	 * 
	 * @param message - The email message to send
	 * @returns A Promise that resolves when the email is sent (or queued)
	 */
	sendEmail(message: EmailMessage): Promise<void>;
}
