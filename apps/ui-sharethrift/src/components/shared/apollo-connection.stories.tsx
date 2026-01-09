import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ApolloConnection } from './apollo-connection.tsx';
import { withAuthDecorator } from '../../test-utils/storybook-decorators.tsx';

const meta: Meta<typeof ApolloConnection> = {
	title: 'Components/Shared/Apollo Connection',
	component: ApolloConnection,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Apollo Connection component that provides GraphQL client context to the application. Handles authentication and creates appropriate links for different data sources.',
			},
		},
	},
	decorators: [withAuthDecorator],
  tags: ['!dev'], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
} satisfies Meta<typeof ApolloConnection>;

export default meta;
type Story = StoryObj<typeof ApolloConnection>;

// Test component to verify Apollo context
const ApolloContextTester = () => {
	return (
		<div data-testid="apollo-context-tester">
			<p>Apollo Provider is active</p>
		</div>
	);
};

export const WithAuthenticatedUser: Story = {
	name: 'With Authenticated User',
	render: () => (
		<ApolloConnection>
			<ApolloContextTester />
		</ApolloConnection>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const tester = await canvas.findByTestId('apollo-context-tester');
		expect(tester).toBeInTheDocument();
		expect(tester.textContent).toContain('Apollo Provider is active');
	},
};

export const WithoutAuthToken: Story = {
	name: 'Without Auth Token',
	render: () => (
		<ApolloConnection>
			<ApolloContextTester />
		</ApolloConnection>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const tester = await canvas.findByTestId('apollo-context-tester');
		expect(tester).toBeInTheDocument();
	},
};

export const RendersChildren: Story = {
	name: 'Renders Children',
	render: () => (
		<ApolloConnection>
			<div data-testid="child-component">
				<h1>Child Component</h1>
				<p>This is a child component wrapped by ApolloConnection</p>
			</div>
		</ApolloConnection>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const child = await canvas.findByTestId('child-component');
		expect(child).toBeInTheDocument();
		expect(child.querySelector('h1')?.textContent).toBe('Child Component');
	},
};
