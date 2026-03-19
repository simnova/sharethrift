import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi, beforeEach } from 'vitest';
import { readHtmlFile } from './get-email-template.ts';
import fs from 'fs';

// Mock fs module
vi.mock('fs');

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/get-email-template.feature'),
);

test.for(feature, ({ Scenario }) => {
	const mockFs = fs as typeof fs & {
		readdirSync: ReturnType<typeof vi.fn>;
		readFileSync: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	Scenario('Reading a JSON template file', ({ Given, When, Then }) => {
		const templateName = 'welcome-email';
		const mockContent = JSON.stringify({
			fromEmail: 'test@example.com',
			subject: 'Welcome',
			body: '<html>Welcome!</html>',
		});
		let result: string;

		Given('a JSON email template file exists', () => {
			mockFs.readdirSync = vi
				.fn()
				.mockReturnValue(['welcome-email.json', 'other-template.json']);
			mockFs.readFileSync = vi.fn().mockReturnValue(mockContent);
		});

		When('readHtmlFile is called with the template name', () => {
			result = readHtmlFile(templateName);
		});

		Then('it should return the file contents', () => {
			expect(result).toBe(mockContent);
			expect(mockFs.readFileSync).toHaveBeenCalled();
		});
	});

	Scenario('Reading a template file with .json extension', ({ Given, When, Then }) => {
		const templateName = 'welcome-email.json';
		const mockContent = JSON.stringify({
			fromEmail: 'test@example.com',
			subject: 'Welcome',
			body: '<html>Welcome!</html>',
		});
		let result: string;

		Given('a JSON email template file exists', () => {
			mockFs.readdirSync = vi
				.fn()
				.mockReturnValue(['welcome-email.json', 'other-template.json']);
			mockFs.readFileSync = vi.fn().mockReturnValue(mockContent);
		});

		When(
			'readHtmlFile is called with the full filename including extension',
			() => {
				result = readHtmlFile(templateName);
			},
		);

		Then('it should return the file contents', () => {
			expect(result).toBe(mockContent);
		});
	});

	Scenario('Attempting to read a non-JSON file', ({ Given, When, Then }) => {
		const fileName = 'template.html';

		Given('a file with non-JSON extension', () => {
			// File name already set above
		});

		When('readHtmlFile is called', () => {
			// Handled in Then
		});

		Then('it should throw an error indicating wrong format', () => {
			expect(() => readHtmlFile(fileName)).toThrow(
				'Template must be in HTML format',
			);
		});
	});

	Scenario('Attempting to read a non-existent file', ({ Given, When, Then }) => {
		const templateName = 'non-existent-template';

		Given('a non-existent template name', () => {
			mockFs.readdirSync = vi
				.fn()
				.mockReturnValue(['welcome-email.json', 'other-template.json']);
		});

		When('readHtmlFile is called', () => {
			// Handled in Then
		});

		Then('it should throw a file not found error', () => {
			expect(() => readHtmlFile(templateName)).toThrow(
				`File not found: ${templateName}.json`,
			);
		});
	});

	Scenario('Case-insensitive file matching', ({ Given, When, Then }) => {
		const templateName = 'WELCOME-EMAIL';
		const mockContent = JSON.stringify({
			fromEmail: 'test@example.com',
			subject: 'Welcome',
			body: '<html>Welcome!</html>',
		});
		let result: string;

		Given('a template file with mixed case name', () => {
			mockFs.readdirSync = vi
				.fn()
				.mockReturnValue(['welcome-email.json', 'Other-Template.json']);
			mockFs.readFileSync = vi.fn().mockReturnValue(mockContent);
		});

		When('readHtmlFile is called with different casing', () => {
			result = readHtmlFile(templateName);
		});

		Then('it should find and return the file contents', () => {
			expect(result).toBe(mockContent);
			expect(mockFs.readFileSync).toHaveBeenCalled();
		});
	});
});
