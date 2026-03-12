import { Ability } from '@serenity-js/core';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ComponentType } from 'react';

export class RenderComponents extends Ability {
	static using(): RenderComponents {
		return new RenderComponents();
	}

	render<P extends Record<string, unknown>>(Component: ComponentType<P>, props: P): ReturnType<typeof render> & { user: ReturnType<typeof userEvent.setup> } {
		const wrappedComponent = createElement(Component, props);
		const result = render(wrappedComponent);
		const user = userEvent.setup();
		return { ...result, user };
	}

	cleanupDOM(): void {
		cleanup();
	}
}
