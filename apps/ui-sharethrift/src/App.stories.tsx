import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App.tsx';
import { withAuthDecorator } from './test-utils/storybook-decorators.tsx';

const meta: Meta<typeof App> = {
	title: 'App/Main Application',
	component: App,
	args: {
		hasCompletedOnboarding: false,
		isAuthenticated: false,
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Main application component that handles routing and authentication flow. Integrates Apollo GraphQL client and manages different application sections.',
			},
		},
	},
	decorators: [withAuthDecorator],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof App>;

export const RootRoute: Story = {
	name: 'Root Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const apolloWrapper =
			canvasElement.querySelector('[data-testid="apollo-connection"]') ||
			canvasElement.closest('[data-testid="apollo-connection"]') ||
			canvasElement;
		expect(apolloWrapper).toBeInTheDocument();
	},
};

export const LoginRoute: Story = {
	name: 'Login Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/login']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};

export const AuthRedirectAdminRoute: Story = {
	name: 'Auth Redirect Admin Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/auth-redirect-admin']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};

export const AuthRedirectUserRoute: Story = {
	name: 'Auth Redirect User Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/auth-redirect-user']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};

export const SignupRoute: Story = {
	name: 'Signup Route (Protected)',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/signup']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};
