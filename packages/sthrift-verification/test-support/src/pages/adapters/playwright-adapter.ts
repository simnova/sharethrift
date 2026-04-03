/**
 * Playwright adapter — implements PageAdapter for E2E tests.
 * Wraps Playwright's Page/Locator API behind the universal PageAdapter interface.
 */
import type { ElementHandle, PageAdapter } from '../page-adapter.ts';

type PlaywrightPage = import('@playwright/test').Page;
type PlaywrightLocator = import('@playwright/test').Locator;

class PlaywrightElementHandle implements ElementHandle {
	constructor(private readonly locator: PlaywrightLocator) {}

	async fill(value: string): Promise<void> {
		await this.locator.fill(value);
	}

	async click(): Promise<void> {
		await this.locator.click();
	}

	textContent(): Promise<string | null> {
		return this.locator.textContent();
	}

	getAttribute(name: string): Promise<string | null> {
		return this.locator.getAttribute(name);
	}

	isVisible(): Promise<boolean> {
		return this.locator.isVisible();
	}

	querySelector(selector: string): Promise<ElementHandle | null> {
		const child = this.locator.locator(selector).first();
		return Promise.resolve(new PlaywrightElementHandle(child));
	}

	async querySelectorAll(selector: string): Promise<ElementHandle[]> {
		const all = this.locator.locator(selector);
		const count = await all.count();
		const handles: ElementHandle[] = [];
		for (let i = 0; i < count; i++) {
			handles.push(new PlaywrightElementHandle(all.nth(i)));
		}
		return handles;
	}
}

export class PlaywrightPageAdapter implements PageAdapter {
	constructor(private readonly page: PlaywrightPage) {}

	getByPlaceholder(text: string): ElementHandle {
		return new PlaywrightElementHandle(this.page.getByPlaceholder(text));
	}

	getByRole(role: string, options?: { name?: string | RegExp }): ElementHandle {
		const roleOptions = options?.name ? { name: options.name } : undefined;
		return new PlaywrightElementHandle(
			this.page.getByRole(
				role as Parameters<PlaywrightPage['getByRole']>[0],
				roleOptions,
			),
		);
	}

	locator(selector: string): ElementHandle {
		return new PlaywrightElementHandle(this.page.locator(selector));
	}

	getByText(
		text: string | RegExp,
		_options?: { selector?: string },
	): ElementHandle {
		return new PlaywrightElementHandle(this.page.getByText(text));
	}
}
