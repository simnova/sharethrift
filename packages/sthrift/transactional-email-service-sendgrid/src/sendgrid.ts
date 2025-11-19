import sendgrid from '@sendgrid/mail';
import type { TransactionalEmailService, EmailTemplate } from '@cellix/transactional-email-service';
import type { ServiceBase } from '@cellix/api-services-spec';
import { readHtmlFile } from './get-email-template.js';

export class ServiceTransactionalEmailSendGrid implements TransactionalEmailService {
	private readonly emailTemplateName: string;
	private readonly apiKey: string;
	private isStarted = false;

	constructor(emailTemplateName: string, apiKey?: string) {
		this.emailTemplateName = emailTemplateName;
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.apiKey = apiKey ?? process.env['SENDGRID_API_KEY'] ?? '';
		
		if (!this.apiKey) {
			throw new Error('SENDGRID_API_KEY environment variable is missing or apiKey parameter not provided. Please set it to use SendGrid.');
		}
	}

	public async startUp(): Promise<Exclude<ServiceTransactionalEmailSendGrid, ServiceBase>> {
		if (this.isStarted) {
			throw new Error('ServiceTransactionalEmailSendGrid is already started');
		}
		
		sendgrid.setApiKey(this.apiKey);
		this.isStarted = true;
		console.log('ServiceTransactionalEmailSendGrid started');
		return this as Exclude<ServiceTransactionalEmailSendGrid, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.isStarted) {
			throw new Error('ServiceTransactionalEmailSendGrid is not started - shutdown cannot proceed');
		}
		this.isStarted = false;
		console.log('ServiceTransactionalEmailSendGrid stopped');
	}

	public async sendEmailWithMagicLink(userEmail: string, magicLink: string): Promise<void> {
		if (!this.isStarted) {
			throw new Error('ServiceTransactionalEmailSendGrid is not started');
		}

		console.log('ServiceTransactionalEmailSendGrid.sendEmailWithMagicLink() - email: ', userEmail);
		
		let template: EmailTemplate;
		try {
			template = JSON.parse(readHtmlFile(this.emailTemplateName));
		} catch (err) {
			console.error(`Failed to parse email template JSON for "${this.emailTemplateName}":`, err);
			throw new Error(`Invalid email template JSON: ${this.emailTemplateName}`);
		}
		
		const templateBodyWithMagicLink = this.replaceMagicLink(template.body, magicLink);
		const subject = `${template.subject} ${process.env['SENDGRID_MAGICLINK_SUBJECT_SUFFIX'] ?? ''}`;
		
		await this.sendEmail(userEmail, template, templateBodyWithMagicLink, subject);
	}

	private replaceMagicLink(html: string, link: string): string {
		const magicLinkPlaceholder = /\{\{magicLink\}\}/g;
		return html.replace(magicLinkPlaceholder, link);
	}

	private async sendEmail(
		userEmail: string,
		template: EmailTemplate,
		htmlContent: string,
		subject: string
	): Promise<void> {
		try {
			const response = await sendgrid.send({
				to: userEmail,
				from: template.fromEmail,
				subject: subject,
				html: htmlContent,
			});
			console.log('Email sent successfully via SendGrid');
			console.log(response);
		} catch (error) {
			console.error('Error sending email via SendGrid');
			console.error(error);
			throw error;
		}
	}
}
