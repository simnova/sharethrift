import { Ability, type Actor } from '@serenity-js/core';
import { createElement, type ComponentType } from 'react';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

	static as(actor: Actor): RenderComponents {
		return actor.abilityTo(RenderComponents);
	}

	/**
	 * Render a React component in the headless DOM.
	 *
	 * Returns @testing-library/react render result (queries scoped to container)
	 * plus a userEvent instance for simulating user interactions.
	 */
	render(Component: ComponentType<any>, props: Record<string, any>) {
		const result = render(createElement(Component, props));
		const user = userEvent.setup();
		return { ...result, user };
	}

	/**
	 * Clean up: unmount React trees between scenarios.
	 * DOM globals persist for the entire test run (set up in register-css.mjs).
	 */
	cleanup(): void {
		cleanup();
	}
}
