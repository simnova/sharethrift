import { Ability, type Actor, type UsesAbilities } from '@serenity-js/core';
import type { Browser, BrowserContext, Page } from '@playwright/test';

// Per-actor browser ability registry — supports multi-actor E2E scenarios.
// Falls back to the last-created instance for backward compatibility with
// tasks that call BrowseTheWeb.as(actor) before the actor ability map is accessible.
const actorBrowserMap = new Map<string, BrowseTheWeb>();
let fallbackInstance: BrowseTheWeb | undefined;

// Serenity.js Ability wrapping a Playwright Page for E2E browser interactions
export class BrowseTheWeb extends Ability {
	readonly page: Page;
	private readonly context: BrowserContext;
	private actorName: string | undefined;

	static using(page: Page, context: BrowserContext): BrowseTheWeb {
		const ability = new BrowseTheWeb(page, context);
		fallbackInstance = ability;
		return ability;
	}

	// Register this ability for a specific actor name (called during Cast.prepare)
	registerForActor(name: string): BrowseTheWeb {
		this.actorName = name;
		actorBrowserMap.set(name, this);
		return this;
	}

	static as(actor: UsesAbilities): BrowseTheWeb {
		// Try actor-specific lookup first
		const actorName = 'name' in actor ? (actor as Actor).name : undefined;
		if (actorName) {
			const perActor = actorBrowserMap.get(actorName);
			if (perActor) return perActor;
		}

		// Fallback to module-level instance
		if (!fallbackInstance) {
			throw new Error('No BrowseTheWeb ability is active');
		}
		return fallbackInstance;
	}

	// Returns the active instance without throwing — used by hooks for best-effort screenshot capture
	static current(): BrowseTheWeb | undefined {
		return fallbackInstance;
	}

	private constructor(page: Page, context: BrowserContext) {
		super();
		this.page = page;
		this.context = context;
	}

	async close(): Promise<void> {
		await this.page.close();
		await this.context.close();
		if (this.actorName) {
			actorBrowserMap.delete(this.actorName);
		}
		if (fallbackInstance === this) {
			fallbackInstance = undefined;
		}
	}
}

export interface SharedBrowserState {
	browser: Browser;
	baseUrl: string;
}
