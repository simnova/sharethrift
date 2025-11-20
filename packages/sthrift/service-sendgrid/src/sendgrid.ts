import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import { ServiceTransactionalEmailSendGrid } from '@sthrift/transactional-email-service-sendgrid';
import { ServiceTransactionalEmailMock } from '@sthrift/transactional-email-service-mock';

/**
 * Facade class that maintains backward compatibility with the original SendGrid interface
 * while delegating to either the real SendGrid implementation or the mock implementation
 * based on environment configuration.
 */
export default class SendGrid {
	private service: TransactionalEmailService;

	constructor(emailTemplateName: string) {
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		const apiKey = process.env['SENDGRID_API_KEY'];
		// biome-ignore lint/complexity/useLiteralKeys: Required by TypeScript noPropertyAccessFromIndexSignature
		const nodeEnv = process.env['NODE_ENV'];

		// Use mock in development mode or when API key is explicitly set to 'mock'
		if (nodeEnv === 'development' || apiKey === 'mock') {
			console.log('Using ServiceTransactionalEmailMock (development mode)');
			this.service = new ServiceTransactionalEmailMock(emailTemplateName);
		} else {
			console.log('Using ServiceTransactionalEmailSendGrid (production mode)');
			this.service = new ServiceTransactionalEmailSendGrid(emailTemplateName, apiKey);
		}

		// Start the service immediately to maintain backward compatibility
		this.service.startUp().catch((err) => {
			console.error('Failed to start email service:', err);
			throw err;
		});
	}

	sendEmailWithMagicLink = async (userEmail: string, magicLink: string): Promise<void> => {
		return await this.service.sendEmailWithMagicLink(userEmail, magicLink);
	};
}

