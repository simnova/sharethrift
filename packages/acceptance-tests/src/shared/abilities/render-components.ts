import { Ability } from '@serenity-js/core';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// @ts-expect-error React 19 types not yet in DefinitelyTyped
import { createElement, type ComponentType } from 'react';

export class RenderComponents extends Ability {
	static using(): RenderComponents {
		return new RenderComponents();
	}

	// @ts-expect-error @testing-library/user-event types not fully compatible
	render(Component: ComponentType<unknown>, props: Record<string, unknown>): ReturnType<typeof render> & { user: ReturnType<typeof userEvent.setup> } {
		const wrappedComponent = createElement(Component, props);
		const result = render(wrappedComponent);
		// @ts-expect-error @testing-library/user-event types not fully compatible
		const user = userEvent.setup();
		return { ...result, user };
	}

	cleanupDOM(): void {
		cleanup();
	}
}
