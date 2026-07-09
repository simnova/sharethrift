import type { PageAdapter } from '@cellix/serenity-framework/pages';

export class NavigationPage {
	constructor(private readonly adapter: PageAdapter) {}

	async open(label: string): Promise<void> {
		await this.adapter.goto('/', { waitUntil: 'domcontentloaded' });
		const selectors: Record<string, string> = {
			Home: '.ant-menu-item:visible:has-text("Home")',
			'My Listings': '.ant-menu-item:visible:has-text("My Listings")',
			'My Reservations': '.ant-menu-item:visible:has-text("My Reservations")',
			Messages: '.ant-menu-item:visible:has-text("Messages")',
			Account: '.ant-menu-submenu-title:visible:has-text("Account")',
			Profile: '.ant-menu-item:visible:has-text("Profile")',
			Settings: '.ant-menu-item:visible:has-text("Settings")',
		};
		const home = this.adapter.locator(selectors.Home ?? '');
		await home.waitFor({ state: 'visible', timeout: 30_000 });
		if (label === 'Profile' || label === 'Settings') {
			await this.adapter.locator(selectors.Account ?? '').click();
		}
		const selector = selectors[label];
		if (!selector) throw new Error(`Unsupported navigation destination: ${label}`);
		const destination = this.adapter.locator(selector);
		await destination.waitFor({ state: 'visible', timeout: 30_000 });
		await destination.click();
	}
}
