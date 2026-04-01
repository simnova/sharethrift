import type { Page } from '@playwright/test';

/**
 * Page object for the login page (/login).
 * Covers the OAuth2 login form with email, password, and login button.
 */
export class LoginPage {
	constructor(private readonly page: Page) {}

	get emailInput() { return this.page.getByLabel('Email'); }
	get passwordInput() { return this.page.getByLabel('Password'); }
	get personalLoginButton() { return this.page.getByRole('button', { name: 'Personal Login' }); }

	async goto(): Promise<void> {
		await this.page.goto('/login', { waitUntil: 'networkidle' });
	}

	async login(email: string, password: string): Promise<void> {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.personalLoginButton.click();
	}

	async waitForRedirectComplete(): Promise<void> {
		await this.page.waitForURL(
			(url) =>
				!url.pathname.includes('auth-redirect') &&
				!url.pathname.includes('/login') &&
				!url.hostname.includes('mock-auth'),
			{ timeout: 30_000 },
		);
	}
}
