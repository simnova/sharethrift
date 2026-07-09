import type { PageAdapter } from '@cellix/serenity-framework/pages';

export class HomePage {
	constructor(private readonly adapter: PageAdapter) {}

	get searchInput() {
		return this.adapter.getByPlaceholder('Search');
	}
	get categoryFilter() {
		return this.adapter.getByText('All');
	}
	get locationFilter() {
		return this.adapter.getByText('Philadelphia, PA');
	}
	listing(title: string) {
		return this.adapter.getByText(title);
	}
	selectedCategory(category: string) {
		return this.adapter.locator(`.ant-select-selection-item[title="${category}"]:visible`);
	}

	async visit(): Promise<void> {
		await this.adapter.goto('/', { waitUntil: 'domcontentloaded' });
		await this.searchInput.waitFor({ state: 'visible', timeout: 15_000 });
	}

	async searchFor(query: string): Promise<void> {
		await this.searchInput.fill(query);
		await this.adapter.locator('button:has(.anticon-search):visible').click();
	}

	async openListing(title: string): Promise<void> {
		await this.listing(title).click();
		await this.adapter.waitForURL(/\/listing\//, { timeout: 15_000 });
	}

	async filterByCategory(category: string): Promise<void> {
		await this.adapter.locator('.ant-select-selector:visible').click();
		const option = this.adapter.locator(`.ant-select-item-option[title="${category}"]:visible`);
		await option.waitFor({ state: 'visible', timeout: 15_000 });
		await option.click();
	}
}
