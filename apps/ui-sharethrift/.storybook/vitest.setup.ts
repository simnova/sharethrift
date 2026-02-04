import '@testing-library/jest-dom';
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';
import { vi } from 'vitest';

// Mock React.lazy and Suspense to work synchronously in tests
vi.mock('react', async () => {
	const actualReact = await vi.importActual('react');
	return {
		...actualReact,
		lazy: vi.fn(() => {
			// Return a mock component that renders immediately
			return function MockLazyComponent() {
				return actualReact.createElement('main', null, 'Mock Page Content');
			};
		}),
		Suspense: ({ children }) => {
			// In tests, just render children without suspense boundary
			return children;
		},
	};
});

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
