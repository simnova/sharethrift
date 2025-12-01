import sendgrid from '@sendgrid/mail';
import type {
	TransactionalEmailService,
	EmailRecipient,
	EmailTemplateData,
} from '@cellix/transactional-email-service';
import { TemplateUtils } from '@cellix/transactional-email-service';

/**
 * SendGrid implementation of TransactionalEmailService
 */
export class ServiceTransactionalEmailSendGrid
	implements TransactionalEmailService
{
	private readonly templateUtils: TemplateUtils;

	constructor() {
		// Initialize template utilities
		this.templateUtils = new TemplateUtils();
	}

	startUp(): Promise<void> {
		// biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for process.env
		const apiKey = process.env['SENDGRID_API_KEY'];
		if (!apiKey) {
			throw new Error(
				'SENDGRID_API_KEY environment variable is missing. Please set it to use SendGrid.',
			);
		}
		sendgrid.setApiKey(apiKey);
		console.log('ServiceTransactionalEmailSendGrid started');
		return Promise.resolve();
	}

	shutDown(): Promise<void> {
		console.log('ServiceTransactionalEmailSendGrid stopped');
		return Promise.resolve();
	}

	async sendTemplatedEmail(
		templateName: string,
		recipient: EmailRecipient,
		templateData: EmailTemplateData,
	): Promise<void> {
		const template = this.templateUtils.loadTemplate(templateName);
		const htmlContent = this.templateUtils.substituteVariables(template.body, templateData);
		const subject = this.templateUtils.substituteVariables(template.subject, templateData);

		try {
			await sendgrid.send({
				to: recipient.email,
				from: template.fromEmail,
				subject,
				html: htmlContent,
			});
			console.log(
				`Email sent successfully to ${recipient.email} using template ${templateName}`,
			);
		} catch (error) {
			console.error('Error sending email:', error);
			throw error;
		}
	}

}