import type { ServiceBase } from '@cellix/api-services-spec';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import { ServiceTransactionalEmailMock } from '@sthrift/transactional-email-service-mock';
import { ServiceTransactionalEmailSendGrid } from '@sthrift/transactional-email-service-sendgrid';
import { readHtmlFile } from './get-email-template.js';

/**
 * Facade for transactional email services.
 * Automatically selects between SendGrid (production) and Mock (local development)
 * based on the SENDGRID_API_KEY environment variable.
 *
 * This class also provides higher-level functionality like magic link email sending.
 */
export class ServiceSendGrid implements ServiceBase<ServiceSendGrid> {
	private emailService: TransactionalEmailService | undefined;
	private readonly emailTemplateName: string;

	constructor(emailTemplateName: string) {
		this.emailTemplateName = emailTemplateName;
	}

	public async startUp(): Promise<Exclude<ServiceSendGrid, ServiceBase>> {
		if (this.emailService) {
			throw new Error('ServiceSendGrid is already started');
		}

		// Determine which implementation to use based on environment
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		const sendgridApiKey = process.env['SENDGRID_API_KEY'];

		if (sendgridApiKey && sendgridApiKey !== 'mock') {
			// Production: Use real SendGrid
			console.log('ServiceSendGrid: Using SendGrid implementation');
			this.emailService = new ServiceTransactionalEmailSendGrid(sendgridApiKey);
		} else {
			// Development/Mock: Use mock implementation
			console.log('ServiceSendGrid: Using Mock implementation');
			this.emailService = new ServiceTransactionalEmailMock();
		}

		await this.emailService.startUp();
		return this as Exclude<ServiceSendGrid, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.emailService) {
			throw new Error('ServiceSendGrid is not started');
		}
		await this.emailService.shutDown();
		this.emailService = undefined;
	}

	/**
	 * Send an email with a magic link for passwordless authentication.
	 *
	 * @param userEmail - The recipient's email address
	 * @param magicLink - The magic link URL to include in the email
	 */
	public async sendEmailWithMagicLink(
		userEmail: string,
		magicLink: string,
	): Promise<void> {
		if (!this.emailService) {
			throw new Error('ServiceSendGrid is not started');
		}

		console.log('ServiceSendGrid.sendEmailWithMagicLink() - email:', userEmail);

		// Load and parse email template
		let template: { fromEmail: string; subject: string; body: string };
		try {
			template = JSON.parse(readHtmlFile(this.emailTemplateName));
		} catch (err) {
			console.error(
				`Failed to parse email template JSON for "${this.emailTemplateName}":`,
				err,
			);
			throw new Error(`Invalid email template JSON: ${this.emailTemplateName}`);
		}

		// Replace magic link placeholder in template
		const templateBodyWithMagicLink = this.replaceMagicLink(
			template.body,
			magicLink,
		);

		// Add subject suffix if configured
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		const subjectSuffix = process.env['SENDGRID_MAGICLINK_SUBJECT_SUFFIX'] || '';
		const subject = `${template.subject}${subjectSuffix ? ` ${subjectSuffix}` : ''}`;

		// Send email using the selected implementation
		await this.emailService.sendEmail({
			to: userEmail,
			from: template.fromEmail,
			subject: subject,
			html: templateBodyWithMagicLink,
		});
	}

	/**
	 * Replace magic link placeholder in HTML template.
	 */
	private replaceMagicLink(html: string, link: string): string {
		const magicLinkPlaceholder = /\{\{magicLink\}\}/g;
		return html.replace(magicLinkPlaceholder, link);
	}
}
