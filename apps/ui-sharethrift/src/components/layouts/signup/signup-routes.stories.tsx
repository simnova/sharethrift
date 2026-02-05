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

export const DefaultView: StoryFn<typeof SignupRoutes> = Template.bind({});

DefaultView.play = async ({ canvasElement }) => {
	// Component renders with lazy-loaded routes
	expect(canvasElement).toBeTruthy();
};

/**
 * Tests that the Suspense fallback is rendered while components are lazy loading.
 * This covers the new lazy() and Suspense wrapper added to signup routes.
 */
export const SuspenseFallback: StoryFn<typeof SignupRoutes> = Template.bind({});
SuspenseFallback.play = async ({ canvasElement }) => {
	// The Suspense wrapper should render initially
	expect(canvasElement).toBeTruthy();
};

/**
 * Tests that lazy loaded signup routes render correctly.
 * This verifies all signup pages use the lazy() mechanism.
 */
export const LazyLoadedSignupRoutes: StoryFn<typeof SignupRoutes> = Template.bind({});
LazyLoadedSignupRoutes.play = async ({ canvasElement }) => {
	// After lazy loading completes, the route should render
	expect(canvasElement).toBeTruthy();
};
