import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type Actor, Task } from '@serenity-js/core';
import { NavigationPage } from '../../../shared/pages/navigation.page.ts';
import { AccountSettingsPage } from '../pages/account-settings.page.ts';
export class OpenAccountSettings extends Task {
	static fromNavigation() {
		return new OpenAccountSettings();
	}
	private constructor() {
		super('opens account settings from the navigation');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new NavigationPage(new PlaywrightPageAdapter(page)).open('Settings');
	}
}

export class ChangeFirstName extends Task {
	static to(value: string) {
		return new ChangeFirstName(value);
	}
	private constructor(private readonly value: string) {
		super(`changes the first name to "${value}"`);
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		const updateResponse = page.waitForResponse((response) => {
			const body = response.request().postData();
			return Boolean(body?.includes('HomeAccountSettingsViewContainerUpdatePersonalUser') && body.includes('"query"'));
		});
		await new AccountSettingsPage(new PlaywrightPageAdapter(page)).changeFirstName(this.value);
		const responseBody = (await (await updateResponse).json()) as
			| { data?: { personalUserUpdate?: { status?: { success?: boolean; errorMessage?: string } } } }
			| Array<{ data?: { personalUserUpdate?: { status?: { success?: boolean; errorMessage?: string } } } }>;
		const json = Array.isArray(responseBody) ? responseBody[0] : responseBody;
		if (!json.data?.personalUserUpdate?.status?.success) {
			throw new Error(`Saving account details failed: ${json.data?.personalUserUpdate?.status?.errorMessage ?? JSON.stringify(json)}`);
		}
		await page.waitForLoadState('networkidle').catch(() => undefined);
		await page.reload({ waitUntil: 'domcontentloaded' });
	}
}
