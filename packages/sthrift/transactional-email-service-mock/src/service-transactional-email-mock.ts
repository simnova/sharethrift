import fs from 'node:fs';
import path from 'node:path';
import type {
	TransactionalEmailService,
	EmailRecipient,
	EmailTemplateData,
} from '@sthrift/transactional-email-service';

/**
 * Mock implementation of TransactionalEmailService for local development
 * Saves email HTML to tmp/ directory instead of sending emails
 */
export class ServiceTransactionalEmailMock
	implements TransactionalEmailService
{
	private readonly outputDir: string;
	private readonly baseTemplateDir: string;

	constructor() {
		// Output directory for saved emails
		this.outputDir = path.join(process.cwd(), 'tmp', 'emails');

		// Template directory relative to project root
		this.baseTemplateDir = path.join(
			process.cwd(),
			'./assets/email-templates',
		);
	}

	async startUp(): Promise<void> {
		// Ensure output directory exists
		if (!fs.existsSync(this.outputDir)) {
			fs.mkdirSync(this.outputDir, { recursive: true });
		}
		console.log(
			`ServiceTransactionalEmailMock started - emails will be saved to ${this.outputDir}`,
		);
	}

	async shutDown(): Promise<void> {
		console.log('ServiceTransactionalEmailMock stopped');
	}

	async sendTemplatedEmail(
		templateName: string,
		recipient: EmailRecipient,
		templateData: EmailTemplateData,
	): Promise<void> {
		const template = this.loadTemplate(templateName);
		const htmlContent = this.substituteVariables(template.body, templateData);
		const subject = this.substituteVariables(template.subject, templateData);

		// Create a complete HTML document with metadata
		const fullHtml = this.createEmailHtml(
			recipient,
			subject,
			template.fromEmail,
			htmlContent,
		);

		// Save to file
		const sanitizedEmail = recipient.email.replaceAll(/[@/\\:*?"<>|]/g, '_');
		const timestamp = Date.now();
		const fileName = `${sanitizedEmail}_${templateName.replaceAll('.json', '')}_${timestamp}.html`;
		const filePath = path.join(this.outputDir, fileName);

		fs.writeFileSync(filePath, fullHtml, 'utf-8');
		console.log(
			`Mock email saved to ${filePath} (template: ${templateName}, recipient: ${recipient.email})`,
		);
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
			console.error(
				`Failed to parse email template JSON for "${templateName}":`,
				err,
			);
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
			result = result.replaceAll(placeholder, String(value));
		}
		return result;
	}

	private createEmailHtml(
		recipient: EmailRecipient,
		subject: string,
		from: string,
		bodyHtml: string,
	): string {
		return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${this.escapeHtml(subject)}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .email-metadata { background: #fff; border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .email-metadata dt { font-weight: bold; display: inline; margin-right: 5px; }
        .email-metadata dd { display: inline; margin: 0 0 10px 0; }
        .email-content { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="email-metadata">
        <h2>Email Metadata (Mock Mode)</h2>
        <dl>
            <dt>To:</dt><dd>${this.escapeHtml(recipient.email)}${recipient.name ? ` (${this.escapeHtml(recipient.name)})` : ''}</dd><br>
            <dt>From:</dt><dd>${this.escapeHtml(from)}</dd><br>
            <dt>Subject:</dt><dd>${this.escapeHtml(subject)}</dd><br>
            <dt>Date:</dt><dd>${new Date().toISOString()}</dd>
        </dl>
    </div>
    <div class="email-content">
        ${bodyHtml}
    </div>
</body>
</html>`;
	}

	private escapeHtml(text: string): string {
		const map: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;',
		};
		return text.replaceAll(/[&<>"']/g, (m) => map[m] || m);
	}
}
