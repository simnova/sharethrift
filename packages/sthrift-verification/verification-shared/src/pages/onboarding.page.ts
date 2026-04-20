import type { ElementHandle, PageAdapter } from './page-adapter.ts';

/**
 * Shared onboarding page object backed by the universal page adapter.
 */
export class OnboardingPage {
	constructor(private readonly page: PageAdapter) {}

	get saveAndContinueButton() {
		return this.page.getByRole('button', { name: 'Save and Continue' });
	}

	get usernameInput() {
		return this.page.getByLabel('Username');
	}

	get firstNameInput() {
		return this.page.getByLabel('First Name');
	}

	get lastNameInput() {
		return this.page.getByLabel('Last Name');
	}

	get addressLine1Input() {
		return this.page.getByLabel('Address Line 1');
	}

	get cityInput() {
		return this.page.getByLabel('City');
	}

	get zipCodeInput() {
		return this.page.getByLabel('Zip Code');
	}

	get termsCheckbox() {
		return this.page.getByRole('checkbox');
	}

	async waitForSelectAccountType(): Promise<void> {
		await this.page.waitForURL('**/signup/select-account-type', {
			timeout: 10_000,
		});
	}

	async waitForAccountSetup(): Promise<void> {
		await this.page.waitForURL('**/signup/account-setup', {
			timeout: 10_000,
		});
	}

	async waitForProfileSetup(): Promise<void> {
		await this.page.waitForURL('**/signup/profile-setup', {
			timeout: 10_000,
		});
	}

	async waitForTerms(): Promise<void> {
		await this.page.waitForURL('**/signup/terms', {
			timeout: 10_000,
		});
	}

	async selectCountry(country: string): Promise<void> {
		const countrySelect = await this.getFormControl('Country', '.ant-select');
		const optionSelector = `.ant-select-item-option[title="${country}"]`;

		await countrySelect.click();

		const option = await this.findVisibleElement(optionSelector, 1_000);
		if (option) {
			await option.click();
			return;
		}

		const searchInput = await this.waitForVisibleElement(
			'.ant-select-selection-search-input',
			5_000,
		);
		await searchInput.fill(country);

		const filteredOption = await this.waitForVisibleElement(optionSelector, 5_000);
		await filteredOption.click();
	}

	async selectState(state: string): Promise<void> {
		const stateSelect = await this.getFormControl(
			'State / Province',
			'.ant-select',
		);
		const optionSelector = `.ant-select-item-option[title="${state}"]`;

		await this.page.waitForTimeout(500);
		await stateSelect.click();

		const option = await this.waitForVisibleElement(optionSelector, 5_000);
		await option.click();
	}

	async completeOnboarding(): Promise<void> {
		await this.waitForSelectAccountType();
		await this.saveAndContinueButton.click();

		await this.waitForAccountSetup();
		await this.usernameInput.fill('');
		await this.usernameInput.fill(`testuser_${Date.now()}`);
		await this.saveAndContinueButton.click();

		await this.waitForProfileSetup();
		await this.firstNameInput.fill('Test');
		await this.lastNameInput.fill('User');
		await this.addressLine1Input.fill('123 Test Street');
		await this.cityInput.fill('Testville');
		await this.selectCountry('United States');
		await this.selectState('California');
		await this.zipCodeInput.fill('90210');
		await this.saveAndContinueButton.click();

		await this.waitForTerms();
		await this.termsCheckbox.check();
		await this.saveAndContinueButton.click();

		await this.page.waitForURL((url) => !url.pathname.includes('/signup'), {
			timeout: 15_000,
		});
	}

	private async getFormControl(
		labelText: string,
		controlSelector: string,
	): Promise<ElementHandle> {
		const formItems = await this.page.locatorAll('.ant-form-item');
		for (const item of formItems) {
			const text = await item.textContent();
			if (!text?.includes(labelText)) {
				continue;
			}

			const control = await item.querySelector(controlSelector);
			if (control) {
				return control;
			}
		}

		throw new Error(`Could not find form control for "${labelText}"`);
	}

	private async waitForVisibleElement(
		selector: string,
		timeout: number,
	): Promise<ElementHandle> {
		const handle = await this.findVisibleElement(selector, timeout);
		if (handle) {
			return handle;
		}

		throw new Error(`Could not find visible element for selector "${selector}"`);
	}

	private async findVisibleElement(
		selector: string,
		timeout: number,
	): Promise<ElementHandle | null> {
		const deadline = Date.now() + timeout;
		while (Date.now() <= deadline) {
			const handles = await this.page.locatorAll(selector);
			for (let index = handles.length - 1; index >= 0; index -= 1) {
				const handle = handles[index];
				if (handle && (await handle.isVisible())) {
					return handle;
				}
			}

			await this.page.waitForTimeout(100);
		}

		return null;
	}
}
