import type { PageAdapter } from '@cellix/serenity-framework/pages';
export class AccountSettingsPage {
	constructor(private readonly adapter: PageAdapter) {}
	get profileInformation() {
		return this.adapter.getByText('Profile Information');
	}
	get editProfileButton() {
		return this.adapter.getByRole('button', { name: 'Edit Profile' });
	}
	get firstNameInput() {
		return this.adapter.getByLabel('First Name');
	}
	get saveButton() {
		return this.adapter.getByRole('button', { name: 'Save' });
	}
	firstName(value: string) {
		return this.adapter.getByText(value, { selector: '.ant-card' });
	}
	async changeFirstName(value: string): Promise<void> {
		await this.editProfileButton.click();
		await this.firstNameInput.waitFor({ state: 'visible', timeout: 15_000 });
		await this.firstNameInput.fill(value);
		await this.saveButton.click();
	}
}
