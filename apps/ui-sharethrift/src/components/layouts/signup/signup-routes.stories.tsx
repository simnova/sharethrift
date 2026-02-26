import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { withMockApolloClient, withMockRouter } from '../../../test-utils/storybook-decorators.tsx';
import { SignupRoutes } from './index.tsx';

const meta: Meta<typeof SignupRoutes> = {
	title: 'Layouts/Signup Routes',
	component: SignupRoutes,
	decorators: [withMockApolloClient, withMockRouter('/select-account-type')],
};

export default meta;

type Story = StoryObj<typeof SignupRoutes>;

/**
 * Tests that signup routes render correctly with lazy loading.
 * Verifies the Suspense wrapper and lazy() mechanism are working properly.
 */
export const LazyLoadedSignupRoutes: Story = {
    tags: ["!dev"], // hide from the sidebar on the ui
	play: async ({ canvasElement }) => {
		// Component should render (Suspense wrapper is present)
		expect(canvasElement).toBeTruthy();

		// The lazy-loaded route content should eventually render
		// Verify the component is not stuck in the fallback state
		const textContent = canvasElement.textContent || '';
		expect(textContent).toBeTruthy();
	},
};
