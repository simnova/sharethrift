import fs from 'node:fs';
import path from 'node:path';
import type { EmailTemplateData } from './transactional-email-service.js';

/**
 * Email template structure
 */
export interface EmailTemplate {
	fromEmail: string;
	subject: string;
	body: string;
}

/**
 * Shared template loading and processing utilities
 */
export class TemplateUtils {
	private readonly baseTemplateDir: string;

	constructor() {
		// Template directory relative to project root
		// Search upward from current directory to find the monorepo root containing assets
		this.baseTemplateDir = this.findTemplateDirectory();
	}

	/**
	 * Find the email templates directory by searching upward from the current working directory
	 * @returns Path to the email templates directory
	 */
	private findTemplateDirectory(): string {
		let currentDir = process.cwd();
		
		// First try the default location relative to current working directory
		const defaultPath = path.join(currentDir, './assets/email-templates');
		if (fs.existsSync(defaultPath)) {
			return defaultPath;
		}

		// Search upward for the monorepo root (look for assets/email-templates)
		while (currentDir !== path.dirname(currentDir)) { // Stop at filesystem root
			const templatesPath = path.join(currentDir, 'assets', 'email-templates');
			if (fs.existsSync(templatesPath)) {
				return templatesPath;
			}
			currentDir = path.dirname(currentDir);
		}

		// Fallback: try environment variable if set
		// biome-ignore lint/complexity/useLiteralKeys: Environment variable name may contain special characters
		const envPath = process.env['EMAIL_TEMPLATES_PATH'];
		if (envPath && fs.existsSync(envPath)) {
			return envPath;
		}

		// If nothing found, use the default path (will fail at runtime but with a clearer error)
		return path.join(process.cwd(), './assets/email-templates');
	}

	/**
	 * Load an email template from the templates directory
	 * @param templateName - Name of the template file (with or without .json extension)
	 * @returns Parsed template object
	 */
	loadTemplate(templateName: string): EmailTemplate {
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

	/**
	 * Substitute template variables with actual values
	 * @param template - Template string with {{variable}} placeholders
	 * @param data - Data object with key-value pairs for substitution
	 * @returns String with variables substituted
	 */
	substituteVariables(template: string, data: EmailTemplateData): string {
		let result = template;
		for (const [key, value] of Object.entries(data)) {
			const placeholder = new RegExp(String.raw`\{\{${key}\}\}`, 'g');
			result = result.replaceAll(placeholder, String(value));
		}
		return result;
	}
}