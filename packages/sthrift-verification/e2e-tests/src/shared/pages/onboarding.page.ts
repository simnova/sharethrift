import type { Page } from '@playwright/test';

/**
 * Page object for the post-login onboarding flow.
 * Covers all four signup steps: account type, account setup, profile setup, and terms.
 */
export class OnboardingPage {
	constructor(private readonly page: Page) {}

	// --- Shared ---
	get saveAndContinueButton() { return this.page.getByRole('button', { name: 'Save and Continue' }); }

	// --- Step 1: Select Account Type ---
	async waitForSelectAccountType(): Promise<void> {
		await this.page.waitForURL('**/signup/select-account-type', { timeout: 10_000 });
	}

	// --- Step 2: Account Setup ---
	get usernameInput() { return this.page.getByLabel('Username'); }

	async waitForAccountSetup(): Promise<void> {
		await this.page.waitForURL('**/signup/account-setup', { timeout: 10_000 });
	}

	// --- Step 3: Profile Setup ---
	get firstNameInput() { return this.page.getByLabel('First Name'); }
	get lastNameInput() { return this.page.getByLabel('Last Name'); }
	get addressLine1Input() { return this.page.getByLabel('Address Line 1'); }
	get cityInput() { return this.page.getByLabel('City'); }
	get zipCodeInput() { return this.page.getByLabel('Zip Code'); }
	get countrySelect() { return this.page.locator('.ant-form-item').filter({ hasText: 'Country' }).locator('.ant-select'); }
	get stateSelect() { return this.page.locator('.ant-form-item').filter({ hasText: 'State / Province' }).locator('.ant-select'); }

	async waitForProfileSetup(): Promise<void> {
		await this.page.waitForURL('**/signup/profile-setup', { timeout: 10_000 });
	}

	async selectCountry(country: string): Promise<void> {
		await this.countrySelect.click();
		await this.page.locator('.ant-select-dropdown:visible input.ant-select-selection-search-input, .ant-select-selection-search-input').last().fill(country);
		await this.page.locator(`.ant-select-item-option[title="${country}"]`).click();
	}

	async selectState(state: string): Promise<void> {
		await this.page.waitForTimeout(500);
		await this.stateSelect.click();
		await this.page.locator(`.ant-select-item-option[title="${state}"]`).click();
	}

	// --- Step 4: Terms ---
	get termsCheckbox() { return this.page.getByRole('checkbox'); }

	async waitForTerms(): Promise<void> {
		await this.page.waitForURL('**/signup/terms', { timeout: 10_000 });
	}

	// --- Full flow ---
	async completeOnboarding(): Promise<void> {
		// Step 1: Select Account Type
		await this.waitForSelectAccountType();
		await this.saveAndContinueButton.click();

		// Step 2: Account Setup
		await this.waitForAccountSetup();
		await this.usernameInput.clear();
		await this.usernameInput.fill(`testuser_${Date.now()}`);
		await this.saveAndContinueButton.click();

		// Step 3: Profile Setup
		await this.waitForProfileSetup();
		await this.firstNameInput.fill('Test');
		await this.lastNameInput.fill('User');
		await this.addressLine1Input.fill('123 Test Street');
		await this.cityInput.fill('Testville');
		await this.selectCountry('United States');
		await this.selectState('California');
		await this.zipCodeInput.fill('90210');
		await this.saveAndContinueButton.click();

		// Step 4: Terms
		await this.waitForTerms();
		await this.termsCheckbox.check();
		await this.saveAndContinueButton.click();

		// Wait for navigation to home page
		await this.page.waitForURL(
			(url) => !url.pathname.includes('/signup'),
			{ timeout: 15_000 },
		);
	}
}
