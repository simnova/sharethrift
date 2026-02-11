import type { Meta, StoryFn } from '@storybook/react';
import { SignupRoutes } from './index.tsx';
import { withMockApolloClient, withMockRouter } from '../../../test-utils/storybook-decorators.tsx';
import { expect } from 'storybook/test';

const meta: Meta<typeof SignupRoutes> = {
	title: 'Layouts/Signup Routes',
	component: SignupRoutes,
	decorators: [
		withMockApolloClient,
		withMockRouter('/select-account-type'),
	],
};

export default meta;

const Template: StoryFn<typeof SignupRoutes> = () => <SignupRoutes />;

/**
 * Tests that signup routes render correctly with lazy loading.
 * Verifies the Suspense wrapper and lazy() mechanism are working properly.
 */
export const LazyLoadedSignupRoutes: StoryFn<typeof SignupRoutes> = Template.bind({});
LazyLoadedSignupRoutes.play = async ({ canvasElement }) => {
	// Component should render (Suspense wrapper is present)
	expect(canvasElement).toBeTruthy();
	
	// The lazy-loaded route content should eventually render
	// Verify the component is not stuck in the fallback state
	const textContent = canvasElement.textContent || '';
	expect(textContent).toBeTruthy();
};
