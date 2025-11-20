import sendgrid from '@sendgrid/mail';
import fs from 'node:fs';
import path from 'node:path';
import type {
	TransactionalEmailService,
	EmailRecipient,
	EmailTemplateData,
} from '@sthrift/transactional-email-service';

/**
 * SendGrid implementation of TransactionalEmailService
 */
export class ServiceTransactionalEmailSendGrid
	implements TransactionalEmailService
{
	private readonly baseTemplateDir: string;

	constructor() {
		const apiKey = process.env['SENDGRID_API_KEY'];
		if (!apiKey) {
			throw new Error(
				'SENDGRID_API_KEY environment variable is missing. Please set it to use SendGrid.',
			);
		}
		sendgrid.setApiKey(apiKey);

		// Template directory relative to project root
		this.baseTemplateDir = path.join(
			process.cwd(),
			'./assets/email-templates',
		);
	}

	async startUp(): Promise<void> {
		console.log('ServiceTransactionalEmailSendGrid started');
	}

	async shutDown(): Promise<void> {
		console.log('ServiceTransactionalEmailSendGrid stopped');
	}

	async sendTemplatedEmail(
		templateName: string,
		recipient: EmailRecipient,
		templateData: EmailTemplateData,
	): Promise<void> {
		const template = this.loadTemplate(templateName);
		const htmlContent = this.substituteVariables(template.body, templateData);
		const subject = this.substituteVariables(template.subject, templateData);

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

	private loadTemplate(templateName: string): {
		fromEmail: string;
		subject: string;
		body: string;
	} {
		let fileName = templateName;
		const ext = path.extname(fileName);
		if (!ext) {
			fileName += '.json';
		} else if (ext !== '.json') {
			throw new Error('Template must be in JSON format');
		}

		const files = fs.readdirSync(this.baseTemplateDir);
		const matchedFile = files.find(
			(f) => f.toLowerCase() === fileName.toLowerCase(),
		);
		if (!matchedFile) {
			throw new Error(`Template file not found: ${fileName}`);
		}

		const filePath = path.join(this.baseTemplateDir, matchedFile);
		const fileContent = fs.readFileSync(filePath, 'utf-8');

		try {
			return JSON.parse(fileContent);
		} catch (err) {
			console.error(`Failed to parse email template JSON for "${templateName}":`, err);
			throw new Error(`Invalid email template JSON: ${templateName}`);
		}
	}

	private substituteVariables(
		template: string,
		data: EmailTemplateData,
	): string {
		let result = template;
		for (const [key, value] of Object.entries(data)) {
			const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
			result = result.replace(placeholder, String(value));
		}
		return result;
	}
}
