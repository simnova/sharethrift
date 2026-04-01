import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page.ts';
import { OnboardingPage } from '../pages/onboarding.page.ts';

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
	const loginPage = new LoginPage(page);

	await loginPage.goto();
	await loginPage.login(username, password);
	await loginPage.waitForRedirectComplete();

	// Complete post-login onboarding if redirected to signup
	if (page.url().includes('/signup')) {
		const onboardingPage = new OnboardingPage(page);
		await onboardingPage.completeOnboarding();
	}
}
