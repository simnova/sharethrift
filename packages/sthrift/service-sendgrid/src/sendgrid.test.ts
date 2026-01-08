import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi, beforeEach, afterEach } from 'vitest';
import SendGrid from './sendgrid.ts';
import * as emailTemplate from './get-email-template.ts';
import fs from 'fs';

// Mock dependencies
vi.mock('@sendgrid/mail', () => ({
	default: {
		setApiKey: vi.fn(),
		send: vi.fn(),
	},
}));

vi.mock('./get-email-template.ts', () => ({
	readHtmlFile: vi.fn(),
}));

vi.mock('fs');

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/sendgrid.feature'),
);

test.for(feature, ({ Scenario }) => {
	let sendGridInstance: SendGrid;
	const originalEnv = { ...process.env };
	const mockTemplate = {
		fromEmail: 'test@example.com',
		subject: 'Test Subject',
		body: '<html><a href="{{magicLink}}">Click here</a></html>',
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		process.env = { ...originalEnv };
	});

	Scenario(
		'Constructing SendGrid with missing API key',
		({ Given, When, Then }) => {
			Given('no SENDGRID_API_KEY environment variable', () => {
				delete process.env['SENDGRID_API_KEY'];
			});

			When('SendGrid is constructed', () => {
				// Handled in Then
			});

			Then('it should throw an error about missing API key', () => {
				expect(() => new SendGrid('template.json')).toThrow(
					'SENDGRID_API_KEY environment variable is missing',
				);
			});
		},
	);

	Scenario(
		'Constructing SendGrid with valid API key',
		({ Given, When, Then, And }) => {
			const apiKey = 'test-api-key-123';
			const templateName = 'welcome-email.json';

			Given('a valid SENDGRID_API_KEY environment variable', () => {
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['SENDGRID_API_KEY'] = apiKey;
			});

			And('an email template name', () => {
				// Already defined above
			});

			When('SendGrid is constructed', () => {
				sendGridInstance = new SendGrid(templateName);
			});

			Then('it should initialize with the template name', () => {
				expect(sendGridInstance.emailTemplateName).toBe(templateName);
			});
		},
	);

	Scenario(
		'Sending email with magic link in development mode',
		({ Given, When, Then, And }) => {
			const userEmail = 'user@example.com';
			const magicLink = 'https://example.com/magic/abc123';
			const mockFs = fs as typeof fs & {
				existsSync: ReturnType<typeof vi.fn>;
				mkdirSync: ReturnType<typeof vi.fn>;
				writeFileSync: ReturnType<typeof vi.fn>;
			};

			Given('a SendGrid instance in development mode', () => {
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['SENDGRID_API_KEY'] = 'test-key';
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['NODE_ENV'] = 'development';
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['SENDGRID_MAGICLINK_SUBJECT_SUFFIX'] = '- Dev';

				mockFs.existsSync = vi.fn().mockReturnValue(false);
				mockFs.mkdirSync = vi.fn() as typeof mockFs.mkdirSync;
				mockFs.writeFileSync = vi.fn() as typeof mockFs.writeFileSync;
				vi.mocked(emailTemplate.readHtmlFile).mockReturnValue(
					JSON.stringify(mockTemplate),
				);

				sendGridInstance = new SendGrid('template.json');
			});

			And('a user email and magic link', () => {
				// Already defined above
			});

			When('sendEmailWithMagicLink is called', async () => {
				await sendGridInstance.sendEmailWithMagicLink(userEmail, magicLink);
			});

			Then('it should save the email to a file instead of sending', () => {
				expect(mockFs.mkdirSync).toHaveBeenCalled();
				expect(mockFs.writeFileSync).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Sending email with magic link in production mode',
		({ Given, When, Then, And }) => {
			const userEmail = 'user@example.com';
			const magicLink = 'https://example.com/magic/abc123';
			let sendGridMock: { send: ReturnType<typeof vi.fn> };

			Given('a SendGrid instance in production mode', async () => {
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['SENDGRID_API_KEY'] = 'test-key';
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['NODE_ENV'] = 'production';
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['SENDGRID_MAGICLINK_SUBJECT_SUFFIX'] = '- Prod';

				// biome-ignore lint/suspicious/noExplicitAny: Required for mock type assertion
				sendGridMock = (await import('@sendgrid/mail')).default as any;
				sendGridMock.send = vi.fn().mockResolvedValue([{ statusCode: 202 }]);

				vi.mocked(emailTemplate.readHtmlFile).mockReturnValue(
					JSON.stringify(mockTemplate),
				);

				sendGridInstance = new SendGrid('template.json');
			});

			And('a user email and magic link', () => {
				// Already defined above
			});

			When('sendEmailWithMagicLink is called', async () => {
				await sendGridInstance.sendEmailWithMagicLink(userEmail, magicLink);
			});

			Then('it should send email via SendGrid API', () => {
				expect(sendGridMock.send).toHaveBeenCalledWith(
					expect.objectContaining({
						to: userEmail,
						from: mockTemplate.fromEmail,
						subject: expect.stringContaining(mockTemplate.subject),
						html: expect.stringContaining(magicLink),
					}),
				);
			});
		},
	);

	Scenario(
		'Replacing magic link placeholder in template',
		({ Given, When, Then, And }) => {
			const template =
				'<html><a href="{{magicLink}}">Link 1</a> <a href="{{magicLink}}">Link 2</a></html>';
			const magicLink = 'https://example.com/magic/xyz';
			let result: string;

			Given('an HTML template with magic link placeholder', () => {
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['SENDGRID_API_KEY'] = 'test-key';
				sendGridInstance = new SendGrid('template.json');
			});

			And('a magic link URL', () => {
				// Already defined above
			});

			When('the template is processed', () => {
				// Access private method via type assertion
				// biome-ignore lint/suspicious/noExplicitAny: Required to access private method for testing
				result = (sendGridInstance as any).replaceMagicLink(
					template,
					magicLink,
				);
			});

			Then('it should replace all placeholders with the actual link', () => {
				expect(result).not.toContain('{{magicLink}}');
				expect(result).toContain(magicLink);
				expect((result.match(new RegExp(magicLink, 'g')) || []).length).toBe(2);
			});
		},
	);

	Scenario(
		'Handling invalid email template JSON',
		({ Given, When, Then, And }) => {
			const userEmail = 'user@example.com';
			const magicLink = 'https://example.com/magic/abc123';

			Given('a SendGrid instance with invalid template', () => {
				// biome-ignore lint/complexity/useLiteralKeys: Required for env var access
				process.env['SENDGRID_API_KEY'] = 'test-key';

				vi.mocked(emailTemplate.readHtmlFile).mockReturnValue(
					'{ invalid json content',
				);

				sendGridInstance = new SendGrid('bad-template.json');
			});

			And('a user email and magic link', () => {
				// Already defined above
			});

			When('sendEmailWithMagicLink is called', async () => {
				// Handled in Then
			});

			Then('it should throw an error about invalid template JSON', async () => {
				await expect(
					sendGridInstance.sendEmailWithMagicLink(userEmail, magicLink),
				).rejects.toThrow('Invalid email template JSON');
			});
		},
	);
});
