import { Ability } from '@serenity-js/core';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// @ts-expect-error React 19 types not yet in DefinitelyTyped
import { createElement, type ComponentType } from 'react';

/**
 * RenderComponents - Ability to render and interact with React components in a headless DOM.
 *
 * DOM globals (window, document, navigator) are set up once in register-css.mjs
 * before any modules load. This avoids module-caching issues with @testing-library.
 *
 * @see https://github.com/cucumber/screenplay.js
 */
export class RenderComponents extends Ability {
	static using(): RenderComponents {
		return new RenderComponents();
	}

	/**
	 * Render a React component in the headless DOM.
	 *
	 * Returns @testing-library/react render result (queries scoped to container)
	 * plus a userEvent instance for simulating user interactions.
	 *
	 * Throws descriptive error if component rendering fails.
	 */
	// @ts-expect-error @testing-library/user-event types not fully compatible
	render(Component: ComponentType<unknown>, props: Record<string, unknown>): ReturnType<typeof render> & { user: ReturnType<typeof userEvent.setup> } {
		try {
			const result = render(createElement(Component, props));
			// @ts-expect-error @testing-library/user-event types not fully compatible
			const user = userEvent.setup();
			return { ...result, user };
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(
				`Failed to render component: ${message}. ` +
				`Check that all required props are provided and the component is properly importable.`,
			);
		}
	}

	/**
	 * Clean up: unmount React trees between scenarios.
	 * DOM globals persist for the entire test run (set up in register-css.mjs).
	 */
	cleanupDOM(): void {
		cleanup();
	}
}
