// React render utility for acceptance tests
// Renders components within required providers (Router, etc.) for coverage testing
import { createElement, type ComponentType, type ReactElement } from 'react';
import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

// Make React available globally for components using the classic JSX transform
// or loaded through CJS paths where automatic JSX transform doesn't inject imports
if (!globalThis.React) {
	globalThis.React = React;
}

interface RenderResult {
	html: string;
	cleanup: () => void;
}

/**
 * Render a React component in the jsdom environment for code coverage.
 * Wraps the component with MemoryRouter for components using react-router hooks.
 */
export async function renderForCoverage<P extends Record<string, unknown>>(
	Component: ComponentType<P>,
	props: P,
	options?: { withRouter?: boolean; routerPath?: string },
): Promise<RenderResult> {
	if (typeof document === 'undefined') {
		throw new Error('DOM environment not set up. Call ensureJsdom() first.');
	}

	const container = document.createElement('div');
	document.body.appendChild(container);

	const withRouter = options?.withRouter ?? true;

	let element: ReactElement;
	const componentElement = createElement(Component, props);

	if (withRouter) {
		element = createElement(
			MemoryRouter,
			{ initialEntries: [options?.routerPath ?? '/'] },
			componentElement,
		);
	} else {
		element = componentElement;
	}

	const root: Root = createRoot(container);
	root.render(element);

	// Allow React to flush the render
	await new Promise<void>((resolve) => setTimeout(resolve, 50));

	const html = container.innerHTML;

	return {
		html,
		cleanup: () => {
			root?.unmount();
			container.remove();
		},
	};
}
