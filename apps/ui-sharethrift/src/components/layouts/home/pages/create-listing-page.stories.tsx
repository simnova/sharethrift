import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import { HomeCreateListingContainerCreateItemListingDocument } from '../../../../generated.tsx';
import { HomeRoutes } from '../index.tsx';
import { userIsAdminMockRequest } from '../../../../test-utils/storybook-helpers.ts';

const meta: Meta<typeof HomeRoutes> = {
	title: 'Pages/Create Listing',
	component: HomeRoutes,
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		apolloClient: {
			mocks: [userIsAdminMockRequest('user-1', true)],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
