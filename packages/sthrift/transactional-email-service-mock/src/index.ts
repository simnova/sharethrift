import fs from 'node:fs';
import path from 'node:path';
import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	TransactionalEmailService,
	EmailMessage,
} from '@cellix/transactional-email-service';

/**
 * Mock implementation of the TransactionalEmailService interface.
 * Instead of sending emails, this service saves HTML email templates to a local folder.
 * This enables developers to verify email content and styling locally without using SendGrid.
 */
export class ServiceTransactionalEmailMock implements TransactionalEmailService {
	private readonly outputDir: string;
	private isStarted = false;

	constructor(outputDir?: string) {
		// Default to tmp/ folder in the package directory
		this.outputDir = outputDir ?? path.join(process.cwd(), 'tmp', 'emails');
	}

	// biome-ignore lint/suspicious/useAwait: Required by interface
	public async startUp(): Promise<Exclude<ServiceTransactionalEmailMock, ServiceBase>> {
		if (this.isStarted) {
			throw new Error('ServiceTransactionalEmailMock is already started');
		}

		// Create output directory if it doesn't exist
		if (!fs.existsSync(this.outputDir)) {
			fs.mkdirSync(this.outputDir, { recursive: true });
		}

		this.isStarted = true;
		console.log(`ServiceTransactionalEmailMock started (outputDir: ${this.outputDir})`);
		return this as Exclude<ServiceTransactionalEmailMock, ServiceBase>;
	}

	// biome-ignore lint/suspicious/useAwait: Required by interface
	public async shutDown(): Promise<void> {
		this.isStarted = false;
		console.log('ServiceTransactionalEmailMock stopped');
	}

	/**
	 * "Send" an email by saving it to a local file instead.
	 * The HTML content is written to a file in the output directory.
	 * 
	 * @param message - The email message to save
	 */
	// biome-ignore lint/suspicious/useAwait: Required by interface
	public async sendEmail(message: EmailMessage): Promise<void> {
		if (!this.isStarted) {
			throw new Error('ServiceTransactionalEmailMock is not started');
		}

		try {
			// Sanitize the recipient email for use in filename
			const sanitizedEmail = message.to.replace(/[@/\\:*?"<>|]/g, '_');
			const timestamp = Date.now();
			const fileName = `${sanitizedEmail}_${timestamp}.html`;
			const filePath = path.join(this.outputDir, fileName);

			// Create a complete HTML document with metadata
			const fullHtml = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${message.subject}</title>
	<style>
		.email-metadata {
			background-color: #f5f5f5;
			border: 1px solid #ddd;
			padding: 15px;
			margin-bottom: 20px;
			font-family: monospace;
			font-size: 12px;
		}
		.email-metadata dt {
			font-weight: bold;
			margin-top: 5px;
		}
	</style>
</head>
<body>
	<div class="email-metadata">
		<h3>Email Metadata (Mock - Not sent)</h3>
		<dl>
			<dt>To:</dt>
			<dd>${message.to}</dd>
			<dt>From:</dt>
			<dd>${message.from}</dd>
			<dt>Subject:</dt>
			<dd>${message.subject}</dd>
			<dt>Timestamp:</dt>
			<dd>${new Date(timestamp).toISOString()}</dd>
		</dl>
	</div>
	<hr>
	${message.html}
</body>
</html>`;

			fs.writeFileSync(filePath, fullHtml, 'utf-8');
			console.log(`Mock email saved to: ${filePath}`);
		} catch (error) {
			console.error('Error saving mock email:', error);
			throw error;
		}
	}
}
