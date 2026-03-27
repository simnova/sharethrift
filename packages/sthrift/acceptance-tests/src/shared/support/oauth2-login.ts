import type { Page } from '@playwright/test';

// Performs OAuth2 login via the mock server's /authorize → /token flow
export async function performOAuth2Login(page: Page): Promise<void> {
	await page.goto('/auth-redirect-user', { waitUntil: 'commit' });

	try {
		await page.waitForURL(
			(url) =>
				!url.pathname.includes('auth-redirect') &&
				!url.hostname.includes('mock-auth'),
			{ timeout: 30_000 },
		);
	} catch (error) {
		const currentUrl = page.url();
		const content = await page.content().catch(() => '<content unavailable>');
		throw new Error(
			`OAuth2 login flow did not complete within 30s.\n` +
			`Current URL: ${currentUrl}\n` +
			`Page content (first 2000 chars): ${content.slice(0, 2000)}\n` +
			`Original error: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
