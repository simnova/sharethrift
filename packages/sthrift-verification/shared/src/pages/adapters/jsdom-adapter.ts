/**
 * jsdom adapter — implements PageAdapter for acceptance-test UI tests.
 * Uses container.querySelector / @testing-library fireEvent under the hood.
 *
 * This module is loaded dynamically (after jsdom setup), so static imports are safe.
 */
import { fireEvent } from '@testing-library/react';
import type { ElementHandle, PageAdapter } from '../page-adapter.ts';

class JsdomElementHandle implements ElementHandle {
	constructor(private readonly el: Element | null) {}

	fill(value: string): Promise<void> {
		if (this.el) {
			fireEvent.change(this.el, { target: { value } });
		}
		return Promise.resolve();
	}

	click(): Promise<void> {
		if (this.el) {
			fireEvent.click(this.el);
		}
		return Promise.resolve();
	}

	textContent(): Promise<string | null> {
		return Promise.resolve(this.el?.textContent ?? null);
	}

	getAttribute(name: string): Promise<string | null> {
		return Promise.resolve(this.el?.getAttribute(name) ?? null);
	}

	isVisible(): Promise<boolean> {
		return Promise.resolve(this.el !== null);
	}

	querySelector(selector: string): Promise<ElementHandle | null> {
		const child = this.el?.querySelector(selector) ?? null;
		return Promise.resolve(child ? new JsdomElementHandle(child) : null);
	}

	querySelectorAll(selector: string): Promise<ElementHandle[]> {
		if (!this.el) return Promise.resolve([]);
		return Promise.resolve(
			Array.from(this.el.querySelectorAll(selector)).map(
				(el) => new JsdomElementHandle(el),
			),
		);
	}
}

export class JsdomPageAdapter implements PageAdapter {
	constructor(private readonly container: Element) {}

	getByPlaceholder(text: string): ElementHandle {
		const el = this.container.querySelector(
			`[placeholder="${text}"], [placeholder*="${text}"]`,
		);
		return new JsdomElementHandle(el);
	}

	getByRole(role: string, options?: { name?: string | RegExp }): ElementHandle {
		const candidates = Array.from(
			this.container.querySelectorAll(`[role="${role}"], ${role}`),
		);

		// Also search for semantic elements (button, input, etc.)
		const semanticMap: Record<string, string> = {
			button: 'button',
			textbox: 'input[type="text"], input:not([type]), textarea',
			combobox: 'select, [role="combobox"]',
			table: 'table',
		};
		const semanticSelector = semanticMap[role];
		if (semanticSelector) {
			const semantic = Array.from(
				this.container.querySelectorAll(semanticSelector),
			);
			for (const el of semantic) {
				if (!candidates.includes(el)) candidates.push(el);
			}
		}

		const nameFilter = options?.name;
		if (nameFilter) {
			const match = candidates.find((el) => {
				const text = el.textContent ?? '';
				const ariaLabel = el.getAttribute('aria-label') ?? '';
				if (nameFilter instanceof RegExp) {
					return nameFilter.test(text) || nameFilter.test(ariaLabel);
				}
				return text.includes(nameFilter) || ariaLabel.includes(nameFilter);
			});
			return new JsdomElementHandle(match ?? null);
		}

		return new JsdomElementHandle(candidates[0] ?? null);
	}

	locator(selector: string): ElementHandle {
		const el = this.container.querySelector(selector);
		return new JsdomElementHandle(el);
	}

	getByText(
		text: string | RegExp,
		options?: { selector?: string },
	): ElementHandle {
		const scope = options?.selector
			? (this.container.querySelector(options.selector) ?? this.container)
			: this.container;
		const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
		let node: Node | null;
		// biome-ignore lint/suspicious/noAssignInExpressions: walker pattern
		while ((node = walker.nextNode())) {
			const content = node.textContent ?? '';
			const matches =
				text instanceof RegExp ? text.test(content) : content.includes(text);
			if (matches && node.parentElement) {
				return new JsdomElementHandle(node.parentElement);
			}
		}
		return new JsdomElementHandle(null);
	}
}
