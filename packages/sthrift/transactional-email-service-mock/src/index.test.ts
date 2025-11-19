import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { ServiceTransactionalEmailMock } from './index.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('ServiceTransactionalEmailMock Unit Tests', () => {
	let service: ServiceTransactionalEmailMock;
	const testOutputDir = path.join(__dirname, '../test-output');
	const testTemplatesDir = path.join(__dirname, '../test-templates');

	beforeAll(() => {
		// Create test templates directory and sample template
		if (!fs.existsSync(testTemplatesDir)) {
			fs.mkdirSync(testTemplatesDir, { recursive: true });
		}

		// Create a test email template
		const testTemplate = {
			fromEmail: 'test@example.com',
			subject: 'Test Magic Link',
			body: '<html><body><h1>Welcome!</h1><p>Click here: {{magicLink}}</p></body></html>'
		};
		
		const assetsDir = path.join(process.cwd(), 'assets', 'email-templates');
		if (!fs.existsSync(assetsDir)) {
			fs.mkdirSync(assetsDir, { recursive: true });
		}
		fs.writeFileSync(
			path.join(assetsDir, 'test-template.json'),
			JSON.stringify(testTemplate),
			'utf-8'
		);
	});

	afterAll(() => {
		// Cleanup test directories
		const assetsDir = path.join(process.cwd(), 'assets', 'email-templates', 'test-template.json');
		if (fs.existsSync(assetsDir)) {
			fs.unlinkSync(assetsDir);
		}
		
		if (fs.existsSync(testOutputDir)) {
			fs.rmSync(testOutputDir, { recursive: true, force: true });
		}
		
		if (fs.existsSync(testTemplatesDir)) {
			fs.rmSync(testTemplatesDir, { recursive: true, force: true });
		}
	});

	beforeEach(() => {
		// Clean output directory before each test
		if (fs.existsSync(testOutputDir)) {
			fs.rmSync(testOutputDir, { recursive: true, force: true });
		}
	});

	afterEach(async () => {
		// Ensure service is shut down after each test
		if (service) {
			try {
				await service.shutDown();
			} catch (e) {
				// Ignore if already shut down
			}
		}
	});

	describe('Service Lifecycle', () => {
		it('should start up successfully in mock mode', async () => {
			service = new ServiceTransactionalEmailMock('test-template', testOutputDir);
			await service.startUp();
			
			expect(service).toBeDefined();
			expect(fs.existsSync(testOutputDir)).toBe(true);
			
			await service.shutDown();
		});

		it('should throw error when starting up twice', async () => {
			service = new ServiceTransactionalEmailMock('test-template', testOutputDir);
			await service.startUp();
			
			await expect(service.startUp()).rejects.toThrow(
				'ServiceTransactionalEmailMock is already started'
			);
			
			await service.shutDown();
		});

		it('should throw error when shutting down without starting', async () => {
			service = new ServiceTransactionalEmailMock('test-template', testOutputDir);
			
			await expect(service.shutDown()).rejects.toThrow(
				'ServiceTransactionalEmailMock is not started - shutdown cannot proceed'
			);
		});

		it('should throw error when sending email without starting', async () => {
			service = new ServiceTransactionalEmailMock('test-template', testOutputDir);
			
			await expect(
				service.sendEmailWithMagicLink('user@example.com', 'https://example.com/magic')
			).rejects.toThrow('ServiceTransactionalEmailMock is not started');
		});
	});

	describe('Email Operations', () => {
		beforeEach(async () => {
			service = new ServiceTransactionalEmailMock('test-template', testOutputDir);
			await service.startUp();
		});

		afterEach(async () => {
			await service.shutDown();
		});

		it('should save email to file when sending magic link', async () => {
			const userEmail = 'test@example.com';
			const magicLink = 'https://example.com/magic/abc123';

			await service.sendEmailWithMagicLink(userEmail, magicLink);

			// Check that file was created
			const files = fs.readdirSync(testOutputDir);
			expect(files.length).toBe(1);
			
			const savedFile = files[0];
			expect(savedFile).toContain('test_example.com'); // Email sanitized
			expect(savedFile).toMatch(/\.html$/);
		});

		it('should replace magic link placeholder in email body', async () => {
			const userEmail = 'test@example.com';
			const magicLink = 'https://example.com/magic/abc123';

			await service.sendEmailWithMagicLink(userEmail, magicLink);

			const files = fs.readdirSync(testOutputDir);
			const savedFile = path.join(testOutputDir, files[0]!);
			const content = fs.readFileSync(savedFile, 'utf-8');

			expect(content).toContain(magicLink);
			expect(content).not.toContain('{{magicLink}}');
		});

		it('should include email metadata in saved file', async () => {
			const userEmail = 'user@example.com';
			const magicLink = 'https://example.com/magic/abc123';

			await service.sendEmailWithMagicLink(userEmail, magicLink);

			const files = fs.readdirSync(testOutputDir);
			const savedFile = path.join(testOutputDir, files[0]!);
			const content = fs.readFileSync(savedFile, 'utf-8');

			expect(content).toContain(userEmail);
			expect(content).toContain('Test Magic Link');
			expect(content).toContain('<strong>To:</strong>');
			expect(content).toContain('<strong>Subject:</strong>');
		});

		it('should sanitize email address for filename', async () => {
			const unsafeEmail = 'user+test@example.com';
			const magicLink = 'https://example.com/magic/abc123';

			await service.sendEmailWithMagicLink(unsafeEmail, magicLink);

			const files = fs.readdirSync(testOutputDir);
			const fileName = files[0]!;
			
			// Filename should not contain @ or + characters
			expect(fileName).not.toContain('@');
			expect(fileName).not.toContain('+');
		});

		it('should create multiple email files', async () => {
			await service.sendEmailWithMagicLink('user1@example.com', 'https://example.com/magic/1');
			await service.sendEmailWithMagicLink('user2@example.com', 'https://example.com/magic/2');
			await service.sendEmailWithMagicLink('user3@example.com', 'https://example.com/magic/3');

			const files = fs.readdirSync(testOutputDir);
			expect(files.length).toBe(3);
		});
	});
});
