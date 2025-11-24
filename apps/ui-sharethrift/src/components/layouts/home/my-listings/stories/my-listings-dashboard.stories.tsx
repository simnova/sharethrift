import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import { MyListingsDashboard } from '../components/my-listings-dashboard.tsx';

// Mock Apollo Client with MockLink
const mockApolloClient = new ApolloClient({
	link: new MockLink([]),
	cache: new InMemoryCache(),
});

const meta: Meta<typeof MyListingsDashboard> = {
	title: 'My Listings/Dashboard',
	component: MyListingsDashboard,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		onCreateListing: () => console.log('Create listing clicked'),
		requestsCount: 2,
	},
	decorators: [
		(Story) => (
			<ApolloProvider client={mockApolloClient}>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</ApolloProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
