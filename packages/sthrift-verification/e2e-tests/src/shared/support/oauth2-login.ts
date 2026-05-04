import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';
import {
	type E2ELoginPage,
	type E2EOnboardingPage,
	LoginPage,
	OnboardingPage,
} from '@sthrift-verification/verification-shared/pages';
import { PlaywrightPageAdapter } from '@sthrift-verification/verification-shared/pages/playwright';

export interface OAuth2LoginOptions {
	mode?: 'login' | 'signup';
}

function loadTestCredentials(): { username: string; password: string } {
	// Load defaults from .env.test, overridable by actual environment variables
	const envTestPath = path.resolve(
		import.meta.dirname,
		'..',
		'..',
		'..',
		'.env.test',
	);
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
		username:
			process.env['E2E_USERNAME'] ||
			defaults['E2E_USERNAME'] ||
			'alice@example.com',
		password: process.env['E2E_PASSWORD'] || defaults['E2E_PASSWORD'] || '',
	};
}

// Performs OAuth2 auth through the real UI. Default login should land on an
// already onboarded user, while signup mode is allowed to complete onboarding.
export async function performOAuth2Login(
	page: Page,
	options: OAuth2LoginOptions = {},
): Promise<void> {
	const { username, password } = loadTestCredentials();
	const pageAdapter = new PlaywrightPageAdapter(page);
	const loginPage: E2ELoginPage = new LoginPage(pageAdapter);
	const mode = options.mode ?? 'login';

	try {
		await loginPage.goto();
	} catch (gotoError) {
		// Dump page state for debugging login failures
		const url = page.url();
		const content = await page.content().catch(() => '<failed to get content>');
		console.error(
			`[oauth2-login] Failed to load login page.\n` +
				`  URL: ${url}\n` +
				`  HTML (first 2000 chars): ${content.slice(0, 2000)}`,
		);
		throw gotoError;
	}

	if (mode === 'signup') {
		await page.getByRole('button', { name: 'Sign Up' }).click();
	} else {
		await loginPage.login(username, password);
	}

	await loginPage.waitForRedirectComplete();

	// Signup mode still needs the full onboarding flow. Standard login should
	// usually land on the app, but we tolerate /signup in case a fixture is reset.
	if (pageAdapter.url().includes('/signup')) {
		const onboardingPage: E2EOnboardingPage = new OnboardingPage(pageAdapter);
		await onboardingPage.completeOnboarding();
	}
}
