import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { CreateListing } from './create-listing-page.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import { HomeCreateListingContainerCreateItemListingDocument } from '../../../../generated.tsx';

const meta: Meta<typeof CreateListing> = {
	title: 'Pages/CreateListingPage',
	component: CreateListing,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeCreateListingContainerCreateItemListingDocument,
						variables: {
							input: expect.any(Object),
						},
					},
					result: {
						data: {
							createItemListing: {
								__typename: 'ItemListing',
								id: '1',
								title: 'Test Listing',
								state: 'Active',
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/create-listing')],
};

export default meta;
type Story = StoryObj<typeof CreateListing>;

export const Authenticated: Story = {
	args: {
		isAuthenticated: true,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Unauthenticated: Story = {
	args: {
		isAuthenticated: false,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
