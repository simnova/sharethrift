import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';

function loadTestCredentials(): { username: string; password: string } {
	// Load defaults from .env.test, overridable by actual environment variables
	const envTestPath = path.resolve(import.meta.dirname, '..', '..', '..', '.env.test');
	const defaults: Record<string, string> = {};

	if (fs.existsSync(envTestPath)) {
		for (const line of fs.readFileSync(envTestPath, 'utf-8').split('\n')) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) continue;
			const eqIdx = trimmed.indexOf('=');
			if (eqIdx === -1) continue;
			defaults[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
		}
	}

	return {
		username: process.env['E2E_USERNAME'] || defaults['E2E_USERNAME'] || 'test@sharethrift.local',
		password: process.env['E2E_PASSWORD'] || defaults['E2E_PASSWORD'] || '',
	};
}

// Performs OAuth2 login by filling out the login form like a real user,
// then completes the full onboarding flow (account type, account setup,
// profile, terms) before the app is ready for test scenarios.
export async function performOAuth2Login(page: Page): Promise<void> {
	const { username, password } = loadTestCredentials();

	// Navigate to the login page
	await page.goto('/login', { waitUntil: 'networkidle' });

	// Fill in the login form
	await page.getByLabel('Email').fill(username);
	await page.getByLabel('Password').fill(password);

	// Click "Personal Login" to trigger the OAuth2 redirect flow
	await page.getByRole('button', { name: 'Personal Login' }).click();

	// Wait for the OAuth2 redirect chain to settle on a signup or home page
	await page.waitForURL(
		(url) =>
			!url.pathname.includes('auth-redirect') &&
			!url.pathname.includes('/login') &&
			!url.hostname.includes('mock-auth'),
		{ timeout: 30_000 },
	);

	// Complete post-login onboarding if redirected to signup
	if (page.url().includes('/signup')) {
		await completeOnboarding(page);
	}
}

// Walks through every onboarding step until the user lands on the home page.
async function completeOnboarding(page: Page): Promise<void> {
	// Step 1: Select Account Type — accept the default plan and continue
	await page.waitForURL('**/signup/select-account-type', { timeout: 10_000 });
	await page.getByRole('button', { name: 'Save and Continue' }).click();

	// Step 2: Account Setup — fill username
	await page.waitForURL('**/signup/account-setup', { timeout: 10_000 });
	const usernameField = page.getByLabel('Username');
	await usernameField.clear();
	await usernameField.fill(`testuser_${Date.now()}`);
	await page.getByRole('button', { name: 'Save and Continue' }).click();

	// Step 3: Profile Setup — fill required fields
	await page.waitForURL('**/signup/profile-setup', { timeout: 10_000 });
	await page.getByLabel('First Name').fill('Test');
	await page.getByLabel('Last Name').fill('User');
	await page.getByLabel('Address Line 1').fill('123 Test Street');
	await page.getByLabel('City').fill('Testville');

	// Country — Ant Design Select: click to open dropdown, type to filter, pick option
	const countrySelect = page.locator('.ant-form-item').filter({ hasText: 'Country' }).locator('.ant-select');
	await countrySelect.click();
	await page.locator('.ant-select-dropdown:visible input.ant-select-selection-search-input, .ant-select-selection-search-input').last().fill('United States');
	await page.locator('.ant-select-item-option[title="United States"]').click();

	// Wait for state list to load after country selection
	await page.waitForTimeout(500);

	// State — Ant Design Select
	const stateSelect = page.locator('.ant-form-item').filter({ hasText: 'State / Province' }).locator('.ant-select');
	await stateSelect.click();
	await page.locator('.ant-select-item-option[title="California"]').click();

	await page.getByLabel('Zip Code').fill('90210');

	await page.getByRole('button', { name: 'Save and Continue' }).click();

	// Step 4: Accept Terms — check the checkbox and continue
	await page.waitForURL('**/signup/terms', { timeout: 10_000 });
	await page.getByRole('checkbox').check();
	await page.getByRole('button', { name: 'Save and Continue' }).click();

	// Wait for navigation to home page (onboarding complete)
	await page.waitForURL(
		(url) => !url.pathname.includes('/signup'),
		{ timeout: 15_000 },
	);
}
