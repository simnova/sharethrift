import { Ability, type Actor } from '@serenity-js/core';
import { Window } from 'happy-dom';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

/**
 * BrowseTheWebWithHappyDom - Headless DOM testing with happy-dom
 *
 * This ability renders React components in a headless DOM environment (happy-dom).
 * No browser, no servers, just pure component testing.
 *
 * Used in the "dom" assembly for fast component testing.
 * Benefits:
 * - No browser process (3-5x faster)
 * - No server setup needed
 * - Component-focused testing
 * - Instant feedback
 */
export class BrowseTheWebWithHappyDom extends Ability {
	private window: Window | null = null;
	private rootContainer: HTMLDivElement | null = null;
	private reactRoot: Root | null = null;

	/**
	 * Factory method following Serenity/JS Ability pattern
	 */
	static using(): BrowseTheWebWithHappyDom {
		return new BrowseTheWebWithHappyDom();
	}

	/**
	 * Get the ability from an actor
	 */
	static as(actor: Actor): BrowseTheWebWithHappyDom {
		return actor.abilityTo(BrowseTheWebWithHappyDom);
	}

	/**
	 * Initialize the happy-dom window and React DOM
	 */
	private initializeWindow(): void {
		if (this.window) {
			return;
		}

		// Create a headless DOM window
		this.window = new Window({ url: 'http://localhost:3000' });

		// Set global references for React
		globalThis.window = this.window as any;
		globalThis.document = this.window.document as any;
		globalThis.navigator = this.window.navigator as any;

		// Create a container div for React
		this.rootContainer = this.window.document.createElement('div');
		this.rootContainer.id = 'root';
		this.window.document.body.appendChild(this.rootContainer);

		console.log('[BrowseTheWebWithHappyDom] Window initialized');
	}

	/**
	 * Render a React component
	 */
	async renderComponent(
		Component: React.ComponentType<any>,
		props?: Record<string, any>,
	): Promise<void> {
		if (!this.window) {
			this.initializeWindow();
		}

		// Create React root and render component
		this.reactRoot = createRoot(this.rootContainer!);
		this.reactRoot.render(React.createElement(Component, props || {}));

		// Wait a tick for React to render
		await new Promise((resolve) => setTimeout(resolve, 0));

		console.log('[BrowseTheWebWithHappyDom] Component rendered');
	}

	/**
	 * Fill a form field
	 */
	async fillField(selector: string, value: string): Promise<void> {
		if (!this.window) {
			throw new Error('Window not initialized');
		}

		const element = this.window.document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
		if (!element) {
			throw new Error(`Element not found: ${selector}`);
		}

		element.value = value;

		// Trigger input and change events
		element.dispatchEvent(new (this.window as any).Event('input', { bubbles: true }));
		element.dispatchEvent(new (this.window as any).Event('change', { bubbles: true }));

		console.log(`[BrowseTheWebWithHappyDom] Filled ${selector} with "${value}"`);
	}

	/**
	 * Get the value of a form field
	 */
	async getFieldValue(selector: string): Promise<string> {
		if (!this.window) {
			throw new Error('Window not initialized');
		}

		const element = this.window.document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
		if (!element) {
			throw new Error(`Element not found: ${selector}`);
		}

		return element.value;
	}

	/**
	 * Check if an element exists
	 */
	async elementExists(selector: string): Promise<boolean> {
		if (!this.window) {
			throw new Error('Window not initialized');
		}

		return !!this.window.document.querySelector(selector);
	}

	/**
	 * Get text content of an element
	 */
	async getTextContent(selector: string): Promise<string> {
		if (!this.window) {
			throw new Error('Window not initialized');
		}

		const element = this.window.document.querySelector(selector);
		if (!element) {
			throw new Error(`Element not found: ${selector}`);
		}

		return element.textContent || '';
	}

	/**
	 * Click an element
	 */
	async clickElement(selector: string): Promise<void> {
		if (!this.window) {
			throw new Error('Window not initialized');
		}

		const element = this.window.document.querySelector(selector) as HTMLElement;
		if (!element) {
			throw new Error(`Element not found: ${selector}`);
		}

		element.click();
		console.log(`[BrowseTheWebWithHappyDom] Clicked ${selector}`);
	}

	/**
	 * Clean up - destroy window and unmount React
	 */
	async cleanup(): Promise<void> {
		if (this.reactRoot) {
			this.reactRoot.unmount();
			this.reactRoot = null;
		}

		if (this.window) {
			this.window = null;
		}

		// Clean up globals
		delete (globalThis as any).window;
		delete (globalThis as any).document;
		delete (globalThis as any).navigator;

		console.log('[BrowseTheWebWithHappyDom] Cleaned up');
	}
}
