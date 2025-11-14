// Legacy class (backward compatibility)

// Re-export types from the interface package
export type {
	EmailMessage,
	TransactionalEmailService,
} from '@cellix/transactional-email-service';
export { default as SendGrid } from './sendgrid.js';
// New facade pattern (recommended)
export { ServiceSendGrid } from './service-sendgrid-facade.js';
