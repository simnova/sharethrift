import type { TransactionalEmailService, EmailTemplate } from '@cellix/transactional-email-service';
import type { ServiceBase } from '@cellix/api-services-spec';
import { readHtmlFile } from './get-email-template.js';
import fs from 'fs';
import path from 'path';

export class ServiceTransactionalEmailMock implements TransactionalEmailService {
	private readonly emailTemplateName: string;
	private readonly outputDir: string;
	private isStarted = false;

	constructor(emailTemplateName: string, outputDir?: string) {
		this.emailTemplateName = emailTemplateName;
		// Default to tmp/ inside this package
		this.outputDir = outputDir ?? path.join(process.cwd(), 'tmp', 'emails');
	}

	public async startUp(): Promise<Exclude<ServiceTransactionalEmailMock, ServiceBase>> {
		if (this.isStarted) {
			throw new Error('ServiceTransactionalEmailMock is already started');
		}
		
		// Ensure output directory exists
		if (!fs.existsSync(this.outputDir)) {
			fs.mkdirSync(this.outputDir, { recursive: true });
		}
		
		this.isStarted = true;
		console.log(`ServiceTransactionalEmailMock started in MOCK mode (output: ${this.outputDir})`);
		return this as Exclude<ServiceTransactionalEmailMock, ServiceBase>;
	}

	public async shutDown(): Promise<void> {
		if (!this.isStarted) {
			throw new Error('ServiceTransactionalEmailMock is not started - shutdown cannot proceed');
		}
		this.isStarted = false;
		console.log('ServiceTransactionalEmailMock stopped');
	}

	public async sendEmailWithMagicLink(userEmail: string, magicLink: string): Promise<void> {
		if (!this.isStarted) {
			throw new Error('ServiceTransactionalEmailMock is not started');
		}

		console.log('ServiceTransactionalEmailMock.sendEmailWithMagicLink() - email: ', userEmail);
		
		let template: EmailTemplate;
		try {
			template = JSON.parse(readHtmlFile(this.emailTemplateName));
		} catch (err) {
			console.error(`Failed to parse email template JSON for "${this.emailTemplateName}":`, err);
			throw new Error(`Invalid email template JSON: ${this.emailTemplateName}`);
		}
		
		const templateBodyWithMagicLink = this.replaceMagicLink(template.body, magicLink);
		const subject = `${template.subject} ${process.env['SENDGRID_MAGICLINK_SUBJECT_SUFFIX'] ?? ''}`;
		
		await this.saveEmailToFile(userEmail, subject, templateBodyWithMagicLink);
	}

	private replaceMagicLink(html: string, link: string): string {
		const magicLinkPlaceholder = /\{\{magicLink\}\}/g;
		return html.replace(magicLinkPlaceholder, link);
	}

	private async saveEmailToFile(userEmail: string, subject: string, htmlContent: string): Promise<void> {
		try {
			// Sanitize email for filename
			const sanitizedEmail = userEmail.replace(/[@/\\:*?"<>|+]/g, '_');
			const timestamp = Date.now();
			const fileName = `${sanitizedEmail}_${timestamp}.html`;
			const filePath = path.join(this.outputDir, fileName);
			
			// Create a complete HTML document with subject
			const fullHtml = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>${subject}</title>
</head>
<body>
	<div style="background-color: #f0f0f0; padding: 20px; margin-bottom: 20px;">
		<strong>To:</strong> ${userEmail}<br>
		<strong>Subject:</strong> ${subject}
	</div>
	${htmlContent}
</body>
</html>`;
			
			fs.writeFileSync(filePath, fullHtml, 'utf-8');
			console.log(`Mock email saved to: ${filePath}`);
		} catch (error) {
			console.error('Error saving mock email to file');
			console.error(error);
			throw error;
		}
	}
}
