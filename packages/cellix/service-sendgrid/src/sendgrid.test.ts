import { expect, vi, beforeEach, afterEach, describe, it } from 'vitest';
import SendGrid from './sendgrid.ts';

// Mock dependencies
vi.mock('@sendgrid/mail', () => ({
	default: {
		setApiKey: vi.fn(),
		send: vi.fn(),
	},
}));

// Test suite
describe('SendGrid', () => {
	let sendGridInstance: SendGrid;
	const originalEnv = { ...process.env };

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	describe('constructor', () => {
		it('should throw when SENDGRID_API_KEY is missing', () => {
			delete process.env['SENDGRID_API_KEY'];
			expect(() => new SendGrid('template.json')).toThrow(
				'SENDGRID_API_KEY environment variable is missing',
			);
		});

		it('should initialize with valid API key', () => {
			process.env['SENDGRID_API_KEY'] = 'test-api-key';
			sendGridInstance = new SendGrid('template.json');
			expect(sendGridInstance.emailTemplateName).toBe('template.json');
		});
	});

	describe('sendEmailWithMagicLink', () => {
		beforeEach(() => {
			process.env['SENDGRID_API_KEY'] = 'test-key';
		});

		it('should throw on invalid template JSON', async () => {
			sendGridInstance = new SendGrid('template.json');
			// Mock template reading
			await expect(
				sendGridInstance.sendEmailWithMagicLink('user@example.com', 'link'),
			).rejects.toThrow();
		});
	});
});
