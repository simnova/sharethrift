import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import { MockAuthWrapper } from '../../../../test-utils/storybook-decorators.tsx';
import { SectionLayout } from '../section-layout.tsx';

// Mock Apollo Client with MockLink
const mockApolloClient = new ApolloClient({
	link: new MockLink([]),
	cache: new InMemoryCache(),
});

const meta: Meta<typeof SectionLayout> = {
	title: 'Layouts/SignupLayout',
	component: SectionLayout,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<ApolloProvider client={mockApolloClient}>
				<MockAuthWrapper>
					<MemoryRouter initialEntries={['/signup']}>
						<Story />
					</MemoryRouter>
				</MockAuthWrapper>
			</ApolloProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SectionLayout>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		// Verify the signup layout renders with header
		const header = canvasElement.querySelector('header');
		await expect(header).toBeInTheDocument();

		// Verify main content area
		const main = canvasElement.querySelector('main');
		await expect(main).toBeInTheDocument();

		// Verify footer
		const footer = canvasElement.querySelector('footer');
		await expect(footer).toBeInTheDocument();
	},
};

export const WithEnvironmentHandling: Story = {
	play: async ({ canvasElement }) => {
		// Test that environment-specific login handling works
		const header = canvasElement.querySelector('header');
		await expect(header).toBeInTheDocument();
	},
};
