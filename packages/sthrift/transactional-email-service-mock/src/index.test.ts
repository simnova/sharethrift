import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ServiceTransactionalEmailMock } from './index.ts';

describe('ServiceTransactionalEmailMock', () => {
	let service: ServiceTransactionalEmailMock;
	const testOutputDir = path.join(process.cwd(), 'tmp', 'test-emails');

	afterAll(() => {
		// Clean up test directory after all tests
		if (fs.existsSync(testOutputDir)) {
			fs.rmSync(testOutputDir, { recursive: true, force: true });
		}
	});

	describe('Service Lifecycle', () => {
		beforeEach(() => {
			// Clean up test directory before each test in this block
			if (fs.existsSync(testOutputDir)) {
				fs.rmSync(testOutputDir, { recursive: true, force: true });
			}
		});

		it('should start up successfully', async () => {
			service = new ServiceTransactionalEmailMock(testOutputDir);
			await service.startUp();
			expect(service).toBeDefined();
			expect(fs.existsSync(testOutputDir)).toBe(true);
			await service.shutDown();
		});

		it('should throw error when starting up twice', async () => {
			service = new ServiceTransactionalEmailMock(testOutputDir);
			await service.startUp();
			await expect(service.startUp()).rejects.toThrow(
				'ServiceTransactionalEmailMock is already started',
			);
			await service.shutDown();
		});

		it('should throw error when sending email without starting', async () => {
			service = new ServiceTransactionalEmailMock(testOutputDir);
			await expect(
				service.sendEmail({
					to: 'test@example.com',
					from: 'noreply@example.com',
					subject: 'Test',
					html: '<p>Test</p>',
				}),
			).rejects.toThrow('ServiceTransactionalEmailMock is not started');
		});
	});

	describe('Email Sending', () => {
		beforeAll(async () => {
			// Clean up test directory before starting service
			if (fs.existsSync(testOutputDir)) {
				fs.rmSync(testOutputDir, { recursive: true, force: true });
			}
			service = new ServiceTransactionalEmailMock(testOutputDir);
			await service.startUp();
		});

		beforeEach(() => {
			// Clean files between tests
			if (fs.existsSync(testOutputDir)) {
				const files = fs.readdirSync(testOutputDir);
				for (const file of files) {
					fs.unlinkSync(path.join(testOutputDir, file));
				}
			}
		});

		afterAll(async () => {
			await service.shutDown();
		});

		it('should save email as HTML file', async () => {
			const message = {
				to: 'user@example.com',
				from: 'noreply@example.com',
				subject: 'Test Email',
				html: '<h1>Hello World</h1><p>This is a test email.</p>',
			};

			await service.sendEmail(message);

			// Check that a file was created
			const files = fs.readdirSync(testOutputDir);
			expect(files.length).toBe(1);

			// Check that the file contains the expected content
			const filePath = path.join(testOutputDir, files[0] as string);
			const content = fs.readFileSync(filePath, 'utf-8');

			expect(content).toContain('user@example.com');
			expect(content).toContain('noreply@example.com');
			expect(content).toContain('Test Email');
			expect(content).toContain('<h1>Hello World</h1>');
			expect(content).toContain('This is a test email.');
			expect(content).toContain('Email Metadata');
		});

		it('should sanitize email address in filename', async () => {
			const message = {
				to: 'user+test@example.com',
				from: 'noreply@example.com',
				subject: 'Test',
				html: '<p>Test</p>',
			};

			await service.sendEmail(message);

			const files = fs.readdirSync(testOutputDir);
			expect(files.length).toBe(1);

			// Check that special characters are replaced
			const fileName = files[0] as string;
			expect(fileName).not.toContain('@');
			expect(fileName).not.toContain('+');
			expect(fileName).toContain('_');
		});

		it('should create multiple email files', async () => {
			const messages = [
				{
					to: 'user1@example.com',
					from: 'noreply@example.com',
					subject: 'Email 1',
					html: '<p>First email</p>',
				},
				{
					to: 'user2@example.com',
					from: 'noreply@example.com',
					subject: 'Email 2',
					html: '<p>Second email</p>',
				},
				{
					to: 'user3@example.com',
					from: 'noreply@example.com',
					subject: 'Email 3',
					html: '<p>Third email</p>',
				},
			];

			for (const message of messages) {
				await service.sendEmail(message);
			}

			const files = fs.readdirSync(testOutputDir);
			expect(files.length).toBe(3);
		});

		it('should include timestamp in metadata', async () => {
			const message = {
				to: 'user@example.com',
				from: 'noreply@example.com',
				subject: 'Test Email',
				html: '<p>Test</p>',
			};

			const beforeTime = new Date();
			await service.sendEmail(message);
			const afterTime = new Date();

			const files = fs.readdirSync(testOutputDir);
			const filePath = path.join(testOutputDir, files[0] as string);
			const content = fs.readFileSync(filePath, 'utf-8');

			// Check that timestamp is in ISO format
			const timestampMatch = content.match(
				/<dd>(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)<\/dd>/,
			);
			expect(timestampMatch).toBeTruthy();

			if (timestampMatch && timestampMatch[1]) {
				const emailTime = new Date(timestampMatch[1]);
				expect(emailTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
				expect(emailTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
			}
		});
	});
});
