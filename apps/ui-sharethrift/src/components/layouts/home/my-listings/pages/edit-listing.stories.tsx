import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { EditListing } from './edit-listing.tsx';

const mockClient = new ApolloClient({
	link: new MockLink([]),
	cache: new InMemoryCache(),
});

const meta: Meta<typeof EditListing> = {
	title: 'Pages/MyListings/EditListing',
	component: EditListing,
	decorators: [
		(Story) => (
			<ApolloProvider client={mockClient}>
				<MemoryRouter initialEntries={['/my-listings/edit/listing-123']}>
					<Routes>
						<Route path="/my-listings/edit/:listingId" element={<Story />} />
					</Routes>
				</MemoryRouter>
			</ApolloProvider>
		),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Edit Listing page placeholder component.',
			},
		},
	},
} satisfies Meta<typeof EditListing>;

export default meta;
type Story = StoryObj<typeof EditListing>;

export const Default: Story = {
	name: 'Default',
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const content = canvasElement.textContent;
		// Component shows error state without mocked data
		expect(content).toContain('An error occurred');
	},
};
