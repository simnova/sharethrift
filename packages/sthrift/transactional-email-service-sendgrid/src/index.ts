import sendgrid from '@sendgrid/mail';
import type { ServiceBase } from '@cellix/api-services-spec';
import type {
	TransactionalEmailService,
	EmailMessage,
} from '@cellix/transactional-email-service';

/**
 * SendGrid implementation of the TransactionalEmailService interface.
 * This class handles sending emails via SendGrid's API.
 */
export class ServiceTransactionalEmailSendGrid implements TransactionalEmailService {
	private readonly apiKey: string;
	private isStarted = false;

	constructor(apiKey?: string) {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		this.apiKey = apiKey ?? process.env['SENDGRID_API_KEY'] ?? '';
		if (!this.apiKey) {
			console.warn(
				'ServiceTransactionalEmailSendGrid: SENDGRID_API_KEY not configured. Service will not function until an API key is provided.',
			);
		}
	}

	// biome-ignore lint/suspicious/useAwait: Required by interface
	public async startUp(): Promise<Exclude<ServiceTransactionalEmailSendGrid, ServiceBase>> {
		if (this.isStarted) {
			throw new Error('ServiceTransactionalEmailSendGrid is already started');
		}
		if (!this.apiKey) {
			throw new Error(
				'ServiceTransactionalEmailSendGrid: Cannot start without API key. Please set SENDGRID_API_KEY environment variable.',
			);
		}
		sendgrid.setApiKey(this.apiKey);
		this.isStarted = true;
		console.log('ServiceTransactionalEmailSendGrid started');
		return this as Exclude<ServiceTransactionalEmailSendGrid, ServiceBase>;
	}

	// biome-ignore lint/suspicious/useAwait: Required by interface
	public async shutDown(): Promise<void> {
		this.isStarted = false;
		console.log('ServiceTransactionalEmailSendGrid stopped');
	}

	/**
	 * Send a transactional email via SendGrid.
	 * @param message - The email message to send
	 */
	public async sendEmail(message: EmailMessage): Promise<void> {
		if (!this.isStarted) {
			throw new Error('ServiceTransactionalEmailSendGrid is not started');
		}

		try {
			const response = await sendgrid.send({
				to: message.to,
				from: message.from,
				subject: message.subject,
				html: message.html,
			});
			console.log('Email sent successfully via SendGrid');
			console.log(response);
		} catch (error) {
			console.error('Error sending email via SendGrid:', error);
			throw error;
		}
	}
}
