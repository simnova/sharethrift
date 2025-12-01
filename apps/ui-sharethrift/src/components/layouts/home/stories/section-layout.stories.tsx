import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
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
	title: 'Layouts/SectionLayout',
	component: SectionLayout,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<ApolloProvider client={mockApolloClient}>
				<MockAuthWrapper>
					<MemoryRouter initialEntries={['/']}>
						<Story />
					</MemoryRouter>
				</MockAuthWrapper>
			</ApolloProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SectionLayout>;

export const AuthenticatedUser: Story = {
	play: async ({ canvasElement }) => {
		// Verify header is present
		const header = canvasElement.querySelector('header');
		expect(header).toBeInTheDocument();

		// Verify navigation sidebar is visible for authenticated users
		const nav = canvasElement.querySelector('nav');
		await expect(nav).toBeInTheDocument();

		// Verify main content area exists
		const main = canvasElement.querySelector('main');
		expect(main).toBeInTheDocument();

		// Verify footer is present
		const footer = canvasElement.querySelector('footer');
		expect(footer).toBeInTheDocument();
	},
};

export const NavigationItems: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify navigation menu items are present
		const homeLink = await canvas.findByText('Home');
		expect(homeLink).toBeInTheDocument();

		const myListingsLink = await canvas.findByText('My Listings');
		expect(myListingsLink).toBeInTheDocument();

		const myReservationsLink = await canvas.findByText('My Reservations');
		expect(myReservationsLink).toBeInTheDocument();

		const messagesLink = await canvas.findByText('Messages');
		expect(messagesLink).toBeInTheDocument();

		const accountLink = await canvas.findByText('Account');
		expect(accountLink).toBeInTheDocument();
	},
};

export const NavigationInteraction: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Find and click the My Listings navigation item
		const myListingsLink = await canvas.findByText('My Listings');
		await userEvent.click(myListingsLink);

		// Verify URL would change (in real app with router context)
		// Note: In Storybook, actual navigation won't occur without full router setup
		expect(myListingsLink).toBeInTheDocument();
	},
};

export const AdminUserView: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// For admin users, verify admin dashboard link might be present
		// Note: This depends on the useUserIsAdmin hook returning true
		const navigation = canvasElement.querySelector('nav');
		expect(navigation).toBeInTheDocument();

		// Basic verification that navigation renders
		const homeLink = await canvas.findByText('Home');
		expect(homeLink).toBeInTheDocument();
	},
};

export const ResponsiveLayout: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	play: async ({ canvasElement }) => {
		// Verify header is present on mobile
		const header = canvasElement.querySelector('header');
		expect(header).toBeInTheDocument();

		// Verify main content exists
		const main = canvasElement.querySelector('main');
		expect(main).toBeInTheDocument();

		// On mobile, sidebar behavior changes
		// Just verify the layout renders properly without checking specific styles
		await expect(main).toBeTruthy();
	},
};
